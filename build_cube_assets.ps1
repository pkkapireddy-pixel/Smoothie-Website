Add-Type -AssemblyName System.Drawing

$code = @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;

public class ShellThumb {
    [DllImport("shell32.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
    public static extern void SHCreateItemFromParsingName(
        [In] string pszPath,
        [In] IntPtr pbc,
        [In, MarshalAs(UnmanagedType.LPStruct)] Guid riid,
        [Out, MarshalAs(UnmanagedType.Interface)] out IShellItemImageFactory ppv);

    [ComImport]
    [Guid("bcc18b79-ba16-442f-80c4-8a59c30c463b")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IShellItemImageFactory {
        [PreserveSig]
        int GetImage(
            [In, MarshalAs(UnmanagedType.Struct)] SIZE size,
            [In] int flags,
            [Out] out IntPtr phbm);
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct SIZE {
        public int cx;
        public int cy;
        public SIZE(int cx, int cy) { this.cx = cx; this.cy = cy; }
    }

    public static Bitmap GetThumbnail(string path, int width, int height) {
        try {
            Guid uuid = new Guid("bcc18b79-ba16-442f-80c4-8a59c30c463b");
            IShellItemImageFactory factory;
            SHCreateItemFromParsingName(path, IntPtr.Zero, uuid, out factory);
            IntPtr hBitmap;
            int hr = factory.GetImage(new SIZE(width, height), 0x0, out hBitmap);
            if (hr != 0) return null;
            Bitmap bmp = Image.FromHbitmap(hBitmap);
            return bmp;
        } catch {
            return null;
        }
    }
}
"@
Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]80)

function Process-Media($path) {
  $resolved = (Get-Item -LiteralPath $path -ErrorAction SilentlyContinue)
  if (-not $resolved) { 
    Write-Host "File not found: $path"
    return $null 
  }
  $fullPath = $resolved.FullName

  $bmp = $null
  if ($resolved.Extension.ToLower() -eq '.mp4' -or $resolved.Extension.ToLower() -eq '.mov') {
    $bmp = [ShellThumb]::GetThumbnail($fullPath, 512, 512)
  } else {
    try {
      $bmp = [System.Drawing.Bitmap]::FromFile($fullPath)
    } catch {}
  }

  if (-not $bmp) { 
    Write-Host "Failed to get bitmap for: $path"
    return $null 
  }

  $target = New-Object System.Drawing.Bitmap(480, 480)
  $g = [System.Drawing.Graphics]::FromImage($target)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Black)

  $scale = [Math]::Max(480.0 / $bmp.Width, 480.0 / $bmp.Height)
  $dw = [int]($bmp.Width * $scale)
  $dh = [int]($bmp.Height * $scale)
  $dx = [int]((480 - $dw) / 2)
  $dy = [int]((480 - $dh) / 2)

  $g.DrawImage($bmp, $dx, $dy, $dw, $dh)
  $g.Dispose()
  $bmp.Dispose()

  $ms = New-Object System.IO.MemoryStream
  $target.Save($ms, $encoder, $encoderParams)
  $target.Dispose()

  $base64 = [Convert]::ToBase64String($ms.ToArray())
  $ms.Dispose()

  return "data:image/jpeg;base64," + $base64
}

$channels = @(
  @{
    id = 0
    name = "Video Editing"
    subtitle = "Cinematic Cuts & Reels"
    files = @(
      "video-editing-works\RK horror video 2.0.mp4",
      "video-editing-works\Coca-cola & Thums Up.mp4",
      "video-editing-works\Reel - 01.mp4",
      "video-editing-works\Sequence 05.mp4"
    )
  },
  @{
    id = 1
    name = "Graphic Design"
    subtitle = "Brand & Lifestyle Editorial"
    files = @(
      "graphic-design-works\Gold & Silver Jewellery.png",
      "graphic-design-works\Car Detailing Studios.png",
      "graphic-design-works\Flower Shops.png",
      "graphic-design-works\Skincare Brands.png",
      "graphic-design-works\Smart Home Solutions.png",
      "graphic-design-works\Apparel-&-LifestyleArtboard-1.png",
      "graphic-design-works\Salons.png",
      "graphic-design-works\Yoga Studios.png",
      "graphic-design-works\Podcast Studios.png",
      "graphic-design-works\Travel Agencies.png"
    )
  },
  @{
    id = 2
    name = "Graphic Design"
    subtitle = "Visual Aesthetics & Posters"
    files = @(
      "graphic-design-works\Artboard 1.png",
      "graphic-design-works\Artboard 2.png",
      "graphic-design-works\Artboard 3.png",
      "graphic-design-works\Artboard 4.png",
      "graphic-design-works\Artboard 5.png",
      "graphic-design-works\Dance_Music Academies.png",
      "graphic-design-works\Gym & Fitness Centres.png",
      "graphic-design-works\Startups (Tech Non-Tech).png",
      "graphic-design-works\Photography Studios.png",
      "graphic-design-works\Preschools & Play Schools.png"
    )
  },
  @{
    id = 3
    name = "Logo Design"
    subtitle = "Brand Identity & Monograms"
    files = @(
      "logo-designs-works\My Logo\My Logo 2.0.1.png",
      "logo-designs-works\Triguna logo\Triguna logo -1.png",
      "logo-designs-works\Video flux logo\Video flux logo presentation 01.jpg",
      "logo-designs-works\My Logo\Branding Identity MockUp Vol16.png",
      "logo-designs-works\Triguna logo\Triguna logo -2.png",
      "logo-designs-works\Video flux logo\Video flux logo presentation 02.jpg",
      "logo-designs-works\My Logo\Poster Artwork in a Modern Loft MockUp.png",
      "logo-designs-works\My Logo\Stack Business Card Mock-Up.png"
    )
  },
  @{
    id = 4
    name = "Motion Graphics"
    subtitle = "3D Dynamics & VFX"
    files = @(
      "motion-graphics-works\Parallax 3D.mp4",
      "motion-graphics-works\3d.mp4",
      "motion-graphics-works\Map Flight.mp4",
      "motion-graphics-works\3D Stablilze Motion.mp4",
      "motion-graphics-works\Day - 10  Practice 3D.mp4",
      "motion-graphics-works\Day - 6  Practice 2.0.mp4",
      "motion-graphics-works\Day - 13  Practice.mp4",
      "motion-graphics-works\Eraser.mp4"
    )
  },
  @{
    id = 5
    name = "Color Grading"
    subtitle = "DaVinci Tone & LUTs"
    files = @(
      "color-grading-works\Timeline 1.mp4",
      "color-grading-works\Timeline 2.mp4",
      "color-grading-works\Timeline 3.mp4",
      "color-grading-works\Timeline 4.mp4",
      "color-grading-works\Timeline 5.mp4",
      "color-grading-works\Timeline 6.mp4",
      "color-grading-works\DaVinci_Resolve Test VT.mp4"
    )
  }
)

$sb = New-Object System.Text.StringBuilder
$sb.AppendLine("// 3D Rubik's Cube Pre-extracted High-Res Media Dataset") | Out-Null
$sb.AppendLine("// 100% self-contained: works on both http://localhost:8080/ and file:///") | Out-Null
$sb.AppendLine("window.CUBE_ASSETS = [") | Out-Null

for ($c = 0; $c -lt $channels.Count; $c++) {
  $ch = $channels[$c]
  Write-Host "Processing channel $($ch.id): $($ch.name) ($($ch.subtitle))..."
  $sb.AppendLine("  {") | Out-Null
  $sb.AppendLine("    id: $($ch.id),") | Out-Null
  $sb.AppendLine("    name: '$($ch.name)',") | Out-Null
  $sb.AppendLine("    subtitle: '$($ch.subtitle)',") | Out-Null
  $sb.AppendLine("    frames: [") | Out-Null

  $count = 0
  foreach ($f in $ch.files) {
    $uri = Process-Media $f
    if ($uri) {
      $sb.AppendLine("      '$uri',") | Out-Null
      $count++
    }
  }
  Write-Host "  -> extracted $count frames for $($ch.name)"

  $sb.AppendLine("    ]") | Out-Null
  $sb.Append("  }") | Out-Null
  if ($c -lt $channels.Count - 1) { $sb.AppendLine(",") | Out-Null } else { $sb.AppendLine("") | Out-Null }
}

$sb.AppendLine("];") | Out-Null

[System.IO.File]::WriteAllText((Get-Item .).FullName + "\cube-assets.js", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "cube-assets.js updated successfully!"
