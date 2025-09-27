import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import jeremiahBreakupPhoto from './assets/jeremiah_breakup_photo.PNG'

export default function SocialShare() {
  const [showModal, setShowModal] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const canvasRef = useRef(null)

  // Prefer S3-hosted image via HTTPS; fall back to bundled asset if not available
  const S3_PHOTO_URL = 'https://toronto-hackathon.s3.amazonaws.com/jeremiah_breakup_photo.PNG'
  const [photoUrl, setPhotoUrl] = useState(S3_PHOTO_URL)

  // Generate QR code when component mounts
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Use the public S3 URL directly in the QR code
        const imageUrl = S3_PHOTO_URL
        const qrCodeDataUrl = await QRCode.toDataURL(imageUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeUrl(qrCodeDataUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQRCode()
  }, [])

  const fetchPhotoBlob = async () => {
    // Try S3 first; if blocked or fails, fall back to bundled asset
    try {
      const res = await fetch(photoUrl, { cache: 'no-store' })
      if (!res.ok) throw new Error('S3 fetch failed')
      return await res.blob()
    } catch (_) {
      const res2 = await fetch(jeremiahBreakupPhoto)
      return await res2.blob()
    }
  }

  const handleDownload = async () => {
    try {
      const blob = await fetchPhotoBlob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = 'jeremiah_breakup_photo.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(objectUrl)
    } catch (e) {
      console.error('Download failed:', e)
      // Last resort: open the S3/public URL in a new tab
      window.open(photoUrl || jeremiahBreakupPhoto, '_blank')
    }
  }

  const handleShare = async () => {
    // Check if Web Share API is available (mainly on mobile)
    if (navigator.share) {
      try {
        // Convert image to blob for sharing (handles cross-origin)
        const blob = await fetchPhotoBlob()
        const file = new File([blob], 'jeremiah_breakup_photo.png', { type: 'image/png' })
        
        await navigator.share({
          title: 'Jeremiah Breakup Photo',
          text: 'Check out this breakup photo!',
          files: [file]
        })
      } catch (error) {
        console.error('Error sharing:', error)
        // Fallback to download if sharing fails
        handleDownload()
      }
    } else {
      // Fallback for desktop - just download
      handleDownload()
    }
  }

  return (
    <div className="social-share">
      <button 
        className="social-share-button"
        onClick={() => setShowModal(true)}
      >
        📱 Post to Your Socials
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Jeremiah's Breakup Photo</h3>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="photo-container">
                <img 
                  src={photoUrl} 
                  alt="Jeremiah Breakup Photo" 
                  className="breakup-photo"
                  onError={(e) => {
                    // If S3 image fails (CORS or 404), fall back to local asset
                    if (photoUrl !== jeremiahBreakupPhoto) {
                      setPhotoUrl(jeremiahBreakupPhoto)
                      e.currentTarget.src = jeremiahBreakupPhoto
                    }
                  }}
                />
              </div>
              
              <div className="qr-container">
                <p>Scan QR code to save/download:</p>
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code for photo download" 
                    className="qr-code"
                  />
                )}
              </div>
              
              <div className="action-buttons">
                <button 
                  className="share-button"
                  onClick={handleShare}
                >
                  📤 Share Photo
                </button>
                <button 
                  className="download-button"
                  onClick={handleDownload}
                >
                  💾 Download Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
