import { BaseSyntheticEvent, useEffect, useMemo, useRef, useState } from 'react'
import PhotoAlbum, { Photo as PhotoAlbumPhoto } from 'react-photo-album'
import Lightbox, { ImagesListType } from 'react-spring-lightbox'

import { LightBoxHeader } from './components/LightBoxHeader'
import { ArrowButton } from './components/ArrowButton'

import './App.css'

type Photo = {
  id: string
  width: number
  height: number
  urls: {
    small: string
    full: string
  }
}
const options = {
  root: null,
  rootMargin: '10px',
  threshold: 0.8,
}

async function getPhotos(page: number) {
  const response: { results: Photo[] } = await (
    await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&per_page=15&query=river`,
      {
        headers: {
          'Accept-Version': 'v1',
          Authorization:
            'Client-ID d-Yj2ad9DYZCGqGZ1kadzNI_gWoF3yt24b6NWDxia2I',
          'content-type': 'application/json',
        },
      }
    )
  ).json()

  return response
}

function App() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentImageIndex, setCurrentIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const imageContainer = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    getPhotos(page).then(({ results }) => {
      setPhotos((photos) => [...photos, ...results])
    })
  }, [page])

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      entry.isIntersecting && setPage((page) => page + 1)
    }

    const observer = new IntersectionObserver(handleIntersect, options)
    const box = imageContainer.current

    box && observer.observe(box)
    return () => {
      box && observer.unobserve(box)
    }
  }, [imageContainer])

  const imagesForAlbum: PhotoAlbumPhoto[] = useMemo(() => {
    return photos.map(({ urls: { small: src }, width, height }, index) => {
      return { src, width, height, key: index.toString() }
    })
  }, [photos])
  const imagesForLightBox: ImagesListType = useMemo(() => {
    return photos.map((photo) => {
      const {
        urls: { full: src },
      } = photo

      return { src, loading: 'lazy', alt: src }
    })
  }, [photos])

  const handleLightboxPrev = () =>
    currentImageIndex &&
    currentImageIndex > 0 &&
    setCurrentIndex(currentImageIndex - 1)
  const handleLightboxNext = () =>
    currentImageIndex &&
    currentImageIndex + 1 < imagesForAlbum.length &&
    setCurrentIndex(currentImageIndex + 1)
  const handleClose = () => {
    setCurrentIndex(null)
  }
  const handlePhotoAlbumClick = (
    event: BaseSyntheticEvent,
    image: PhotoAlbumPhoto,
    index: number
  ) => {
    setCurrentIndex(index)
  }

  return (
    <div className="App">
      <PhotoAlbum
        layout="masonry"
        photos={imagesForAlbum}
        onClick={handlePhotoAlbumClick}
      />
      <Lightbox
        isOpen={!!currentImageIndex}
        onClose={handleClose}
        onPrev={handleLightboxPrev}
        onNext={handleLightboxNext}
        style={{ background: 'grey' }}
        images={imagesForLightBox}
        renderHeader={() => <LightBoxHeader onClose={handleClose} />}
        renderPrevButton={() => (
          <ArrowButton onClick={handleLightboxPrev} position={'left'} />
        )}
        renderNextButton={() => (
          <ArrowButton onClick={handleLightboxNext} position={'right'} />
        )}
        currentIndex={currentImageIndex ?? 0}
      />
      <div ref={imageContainer} className="intersection-target"></div>
    </div>
  )
}

export default App
