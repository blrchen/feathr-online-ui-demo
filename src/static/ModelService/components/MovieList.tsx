import React, { useEffect, useState } from 'react'

import { Table } from 'antd'
import { Link } from 'react-router-dom'

interface Movie {
  id: number
  title: string
  image_url: string
  overview: string
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Overview',
    dataIndex: 'overview',
    key: 'overview'
  },
  {
    title: 'Image',
    dataIndex: 'image_url',
    key: 'image_url',
    render: (image_url: string) => <img src={image_url} width={100} alt="movie poster" />
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: string, record: Movie) => <Link to={`/movie-details/${record.id}`}>Details</Link>
  }
]

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      setMovies([
        {
          id: 249,
          title: 'Immortal Beloved',
          image_url: 'https://image.tmdb.org/t/p/original/meRFVzGpBJiObWfdtOoNr0UPsP4.jpg',
          overview:
            '"The life and death of the legendary Ludwig van Beethoven. Beside all the work he is known for, the composer once wrote a famous love letter to a nameless beloved and the movie tries to find out who this beloved was. Not easy as Beethoven has had many women in his life."'
        },
        {
          id: 325,
          title: 'Senior Trip',
          image_url: 'https://image.tmdb.org/t/p/original/qfMbFIGNIQ76FEu7Wg48aEbxFh1.jpg',
          overview:
            '"While on detention, a group of misfits and slackers have to write a letter to the President explaining what is wrong with the education system. There is only one problem, the President loves it! Hence, the group must travel to Washington to meet the Main Man."'
        },
        {
          id: 410,
          title: 'Addams Family Values',
          image_url: 'https://image.tmdb.org/t/p/original/zEwEXGDvJ8Ou2s6XbLMPvMTX53S.jpg',
          overview:
            '"Siblings Wednesday and Pugsley Addams will stop at nothing to get rid of Pubert, the new baby boy adored by parents Gomez and Morticia. Things go from bad to worse when the new "black widow" nanny, Debbie Jellinsky, launches her plan to add Fester to her collection of dead husbands."'
        },
        {
          id: 234,
          title: 'Exit to Eden',
          image_url: 'https://image.tmdb.org/t/p/original/9oIEKFVPhgVEzbcbRPDXCdkUgRN.jpg',
          overview:
            '"Elliot is going to the island of Eden to live out his submissive fantasies, but inadvertently photographs diamond smugglers at work. Smugglers, and detectives, follow him to the island, where they try to retrieve the film. Elliot begins falling in love with Lisa, the head mistress of the island, and Lisa must evaluate her feelings about Elliot and her own motivations."'
        }
      ])
    }

    fetchMovies()
  }, [])

  return <Table dataSource={movies} columns={columns} rowKey="id" />
}

export default MovieList
