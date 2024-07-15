
import './App.css';

import Layout from './Layout';
import LoginPage from './LoginPage';
import IndexPage from './pages/IndexPage';

import {Routes,Route} from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPage from './pages/EditPage';




function App() {
  return (
    <UserContextProvider>
       <Routes>

<Route path='/' element={<Layout/>}>

<Route index element={ <main><IndexPage/></main>}/>
<Route path='/login' element={<LoginPage/>}/>
 <Route path='/register' element={<RegisterPage/>}/>
 <Route path='/create' element={<CreatePost/>}/>
 <Route path='/post/:id' element={<PostPage/>}/>
 <Route path='/edit/:id' element={<EditPage/>}/>

</Route>

</Routes>


    </UserContextProvider>
    
     
  );
}

export default App;
