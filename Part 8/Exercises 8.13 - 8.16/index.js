const { v1: uuid } = require('uuid')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()
mongoose.set('strictQuery', false)
const MONGODB_URI = process.env.MONGODB_URI
const Author = require('./Models/Author')
const Book = require('./Models/Book')
const User = require('./Models/User')
const { GraphQLError } = require('graphql')


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })



let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const totalPersonas = async () => {
  const Books = await new Book({})
  return Books
}


const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Authors{
    name: String!,
    _id: ID!,
    born: Int,
    bookCount: Int!
  }  
  type Books{
      title: String!,
      published: Int!,
      author: Authors!
      id: ID!
      genres: [String!]! 
  }
  type Query {
    dummy: Int
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String,genre: String) : [Books!]!
    allAuthors: [Authors]
    me: User
  }

  type Mutation{
    addBook(
      title: String!,
      author: String!,
      published : Int!
      genres : [String!]!
    ): Books
    editAuthor(
      name: String!,
      setBornTo: Int!,
    ): Authors
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
}
`
const resolvers = {
  Query: {
    dummy: () => 0,
    me: (root,args,context) => context.currentUser,
    bookCount: async () => (await Book.find({})).length,
    authorCount: async () => (await Author.find({})).length,
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const idOfAuthor = await Author.findOne({ name: `${args.author}` })
        const booksByGenreAndAuthor = await Book.find({ author: idOfAuthor._id, genres: `${args.genre}` }).populate("author")
        return booksByGenreAndAuthor
      }
      else if (args.genre) {
        const booksByGenre = await Book.find({ genres: `${args.genre}` }).populate("author")
        return booksByGenre
      }
      else if (args.author) {
        const idOfAuthor = await Author.findOne({ name: `${args.author}` })
        return await Book.find({ author: idOfAuthor._id }).populate("author")
      }
      else if (!args.author && !args.genre) {
        return await Book.find({}).populate("author")
      }
    },
    allAuthors: async () => await Author.find({})
  },
  Authors: {
    bookCount: (root) => books.filter(book => root.name === book.author).length
  },
  Mutation: {
    addBook: async (root, args,context) => {
      const author = await Author.findOne({ name: `${args.author}` })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      
      if (!author) {
        const newAuthor = new Author({
          name: args.author,
          born: null
        })

        const newBook = new Book({ ...args, author: newAuthor._id })
        try {
          await newAuthor.save()
          await newBook.save()
        }
        catch (error) {
          throw new GraphQLError(error, {
            extensions: {
              code: 'BAD_USER_INPUT ',
              invalidArgs: args.name,
              error
            }
          })
        }
        return await newBook.populate("author")
      }
      else {
        const newBook = new Book({ ...args, author: author._id })
        try {
          await newBook.save()
        }
        catch (error) {
          throw new GraphQLError(error, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }

        return await newBook.populate("author")
      }
    },
    editAuthor: (root, args) => {
      const Author = authors.findIndex((author) => author.name === args.name)
      if (Author !== -1) {
        authors[Author].born = args.setBornTo
      }
      return authors[Author]
    },
    createUser: async(root,args) => {
      const newUser = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      }) 
      try {
        await newUser.save()
      }
      catch (error) {
        throw new GraphQLError(error, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return newUser;
      
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})