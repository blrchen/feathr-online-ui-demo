export interface PipelineResult {
  pipeline: string
  status: string
  time: number
  count: number
  data: MovieRecommendation[]
}

export interface MovieRecommendation {
  homepage: string
  genres: string[]
  title: string
  release_date: Date
  image_url: string
  vote_average: number
  vote_count: number
  overview: string
  movie_id: number
  runtime: number
  imdb_url: string
  tmdb_url: string
}
