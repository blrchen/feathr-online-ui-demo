import { useEffect, useState } from 'react'

import { Card } from 'antd'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import { MovieRecommendation } from '@/pages/ModelService/models'

const RecommendationList = () => {
  const { id } = useParams<{ id: string }>()
  const [movieRecommendations, setMovieRecommendations] = useState<MovieRecommendation[]>()
  useEffect(() => {
    const fetchMovieRecommendations = async () => {
      const response = await axios.post('https://piper.azurewebsites.net/process', {
        requests: [
          {
            pipeline: 'movie_recommend',
            data: [
              {
                id: id
              }
            ]
          }
        ]
      })
      setMovieRecommendations(response.data.results[0].data)
      console.log(response.data.results[0].data)
    }
    fetchMovieRecommendations()
  }, [id])

  return (
    <div>
      <h1>Recommendation</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {movieRecommendations &&
          movieRecommendations.slice(0, 4).map((movie, index) => (
            <Card
              key={index}
              hoverable
              style={{ width: 150, margin: '20px' }}
              cover={<img alt={movie.title} src={movie.image_url} />}
            >
              <Card.Meta title={movie.title} />
            </Card>
          ))}
      </div>
    </div>
  )
}

export default RecommendationList
