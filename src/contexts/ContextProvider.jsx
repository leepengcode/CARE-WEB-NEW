import { createContext, useContext, useState } from 'react'

const StateContext = createContext({
  currentUser: {},
  userToken: null,
  surveys: [],
  setCurrentUser: () => {},
  setuserToken: () => {},
})

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    name: 'Leepeng',
    email: 'Leepeng@gmail.com',
    imageUrl:
      'https://scontent.fpnh11-1.fna.fbcdn.net/v/t39.30808-6/479546885_1626921591523195_7612299454538453777_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGeQbsaCi1fvnxIxV84DRi8JHEpUaR3o7okcSlRpHejupTUdonH99bKuPewXSle99oNNIwHqi2ce23dnvVsy8iy&_nc_ohc=dh40CMCrpB0Q7kNvgFZRGCm&_nc_oc=Adie0Z2I9Yov8Uzgr1Y6VGX2GkyRxmm9qRb5YUefrQ6F8iVvHyzkdQ5NkzjHjqsytqU&_nc_zt=23&_nc_ht=scontent.fpnh11-1.fna&_nc_gid=H6p4Qj6JYMVJ7w-56m57ug&oh=00_AYFz8TzNzA0CHJhxVIFqoAXycVym4WHZx5RKnUzfT2hSqA&oe=67DF0463',
  })
  const [userToken, setUserToken] = useState('1235')

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useStateContext = () => useContext(StateContext)
