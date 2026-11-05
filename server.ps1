param(
    [int]$Port = 8080
)

$source = @"
using System;
using System.IO;
using System.Net;
using System.Threading;
using System.Collections.Generic;

public class HighSpeedServer {
    private HttpListener _listener;
    private string _root;
    private bool _running;

    public void Start(int port, string root) {
        _root = root;

        try {
            ThreadPool.SetMinThreads(256, 256);
            ThreadPool.SetMaxThreads(1024, 1024);
        } catch {}

        _listener = new HttpListener();
        _listener.IgnoreWriteExceptions = true;

        List<int> ports = new List<int>();
        if (!ports.Contains(port)) ports.Add(port);
        if (!ports.Contains(8080)) ports.Add(8080);
        if (!ports.Contains(5000)) ports.Add(5000);
        if (!ports.Contains(3000)) ports.Add(3000);

        List<string> boundList = new List<string>();

        foreach (int p in ports) {
            try {
                _listener.Prefixes.Add("http://localhost:" + p + "/");
                _listener.Prefixes.Add("http://127.0.0.1:" + p + "/");
                boundList.Add("http://localhost:" + p + "/");
            } catch {}
        }

        try {
            _listener.Start();
            Console.WriteLine("HighSpeedServer active on: " + string.Join(", ", boundList));
        } catch (Exception ex) {
            Console.WriteLine("Server start warning: " + ex.Message);
            // Fallback to single port
            _listener = new HttpListener();
            _listener.IgnoreWriteExceptions = true;
            _listener.Prefixes.Add("http://localhost:" + port + "/");
            _listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
            _listener.Start();
            Console.WriteLine("HighSpeedServer fallback active on port " + port);
        }

        _running = true;

        Thread listenThread = new Thread(ListenLoop);
        listenThread.IsBackground = true;
        listenThread.Start();
    }

    private void ListenLoop() {
        while (_running) {
            try {
                HttpListenerContext context = _listener.GetContext();
                ThreadPool.QueueUserWorkItem(new WaitCallback(HandleRequestCallback), context);
            } catch {
                if (!_running) break;
            }
        }
    }

    private void HandleRequestCallback(object state) {
        HttpListenerContext context = (HttpListenerContext)state;
        try {
            HttpListenerRequest req = context.Request;
            HttpListenerResponse res = context.Response;

            string rel = Uri.UnescapeDataString(req.Url.AbsolutePath.TrimStart('/'));
            if (string.IsNullOrEmpty(rel)) rel = "index.html";
            rel = rel.Replace('/', Path.DirectorySeparatorChar);
            string path = Path.Combine(_root, rel);

            if (File.Exists(path)) {
                string ext = Path.GetExtension(path).ToLowerInvariant();
                string contentType = "application/octet-stream";
                if (ext == ".html") contentType = "text/html; charset=utf-8";
                else if (ext == ".css") contentType = "text/css; charset=utf-8";
                else if (ext == ".js") contentType = "application/javascript; charset=utf-8";
                else if (ext == ".jpg" || ext == ".jpeg") contentType = "image/jpeg";
                else if (ext == ".png") contentType = "image/png";
                else if (ext == ".svg") contentType = "image/svg+xml";
                else if (ext == ".mp4") contentType = "video/mp4";
                else if (ext == ".mov") contentType = "video/mp4";
                else if (ext == ".webp") contentType = "image/webp";
                else if (ext == ".json") contentType = "application/json; charset=utf-8";

                FileInfo fi = new FileInfo(path);
                long totalLength = fi.Length;
                res.ContentType = contentType;
                res.AddHeader("Access-Control-Allow-Origin", "*");
                res.AddHeader("Accept-Ranges", "bytes");

                string rangeHeader = req.Headers["Range"];
                if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes=")) {
                    string rangeSpec = rangeHeader.Substring(6);
                    string[] parts = rangeSpec.Split('-');
                    long start = 0;
                    long end = totalLength - 1;
                    if (!string.IsNullOrEmpty(parts[0])) long.TryParse(parts[0], out start);
                    if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1])) long.TryParse(parts[1], out end);
                    if (end >= totalLength) end = totalLength - 1;
                    long contentLength = end - start + 1;

                    res.StatusCode = 206;
                    res.ContentLength64 = contentLength;
                    res.AddHeader("Content-Range", string.Format("bytes {0}-{1}/{2}", start, end, totalLength));

                    using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 65536)) {
                        fs.Seek(start, SeekOrigin.Begin);
                        byte[] buffer = new byte[65536];
                        long remaining = contentLength;
                        while (remaining > 0) {
                            int toRead = (int)Math.Min(buffer.Length, remaining);
                            int bytesRead = fs.Read(buffer, 0, toRead);
                            if (bytesRead <= 0) break;
                            res.OutputStream.Write(buffer, 0, bytesRead);
                            remaining -= bytesRead;
                        }
                    }
                } else {
                    res.StatusCode = 200;
                    res.ContentLength64 = totalLength;

                    if (ext == ".html" || ext == ".css" || ext == ".js") {
                        res.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                        res.AddHeader("Pragma", "no-cache");
                        res.AddHeader("Expires", "0");
                    } else {
                        res.AddHeader("Cache-Control", "public, max-age=86400");
                    }

                    using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 65536)) {
                        byte[] buffer = new byte[65536];
                        int bytesRead;
                        while ((bytesRead = fs.Read(buffer, 0, buffer.Length)) > 0) {
                            res.OutputStream.Write(buffer, 0, bytesRead);
                        }
                    }
                }
            } else {
                res.StatusCode = 404;
                byte[] notFound = System.Text.Encoding.UTF8.GetBytes("Not Found: " + rel);
                res.OutputStream.Write(notFound, 0, notFound.Length);
            }
        } catch {
        } finally {
            try { context.Response.Close(); } catch {}
        }
    }

    public void Stop() {
        _running = false;
        try { _listener.Stop(); } catch {}
        try { _listener.Close(); } catch {}
    }
}
"@

Add-Type -TypeDefinition $source -ErrorAction SilentlyContinue
$server = [HighSpeedServer]::new()
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
$server.Start($Port, $root)

Write-Host "HTTP server running at http://localhost:$Port/ (and http://localhost:8080/)"

while ($true) {
    Start-Sleep -Seconds 1
}
