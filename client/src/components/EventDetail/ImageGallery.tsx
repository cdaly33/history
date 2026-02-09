import { useState } from 'react';
import type { ImageMeta } from '../../../../shared/types';

interface ImageGalleryProps {
  images: ImageMeta[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [loadErrors, setLoadErrors] = useState<Set<string>>(new Set());

  const handleImageError = (url: string) => {
    setLoadErrors((prev) => new Set(prev).add(url));
  };

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          {loadErrors.has(image.url) ? (
            <div className="image-placeholder">
              <p>Image unavailable</p>
              <p className="image-caption">{image.caption}</p>
            </div>
          ) : (
            <>
              <img
                src={image.url}
                alt={image.caption}
                onError={() => handleImageError(image.url)}
                loading="lazy"
              />
              <figcaption className="image-attribution">
                <p className="image-caption">{image.caption}</p>
                <p className="image-credit">
                  {image.attribution} —{' '}
                  {image.license === 'unknown' ? (
                    <span className="license-unknown">
                      License: Unknown — verify before reuse
                    </span>
                  ) : (
                    image.license
                  )}
                </p>
                {image.sourcePageUrl && (
                  <p className="image-source">
                    <a href={image.sourcePageUrl} target="_blank" rel="noopener noreferrer">
                      Source
                    </a>
                  </p>
                )}
              </figcaption>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
