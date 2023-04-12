import React, { useEffect, useState } from 'react'

import { Descriptions } from 'antd'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import RecommendationList from './RecommendationList'

interface Movie {
  id: number
  title: string
  image_url: string
  overview: string
}

const DetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie>()

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await axios.post('https://piper.azurewebsites.net/process', {
        requests: [
          {
            pipeline: 'movie_metadata',
            data: [
              {
                id: parseInt(id || '')
              }
            ]
          }
        ]
      })
      setMovie(response.data.results[0].data[0])
    }
    fetchMovie()
  }, [])

  if (!movie) {
    return <div>Loading...</div>
  }
  console.log(movie)
  return (
    <>
      <Descriptions title={movie.title}>
        <Descriptions.Item label="">{movie.overview}</Descriptions.Item>
        <Descriptions.Item label="">
          <img src={movie.image_url} width={250} alt="movie poster" />
        </Descriptions.Item>
      </Descriptions>
      <RecommendationList></RecommendationList>
    </>
  )
}

export default DetailsPage
