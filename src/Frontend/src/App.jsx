import React from 'react';
import { Routes, Route } from 'react-router-dom'; // 'Router' burada gereksiz
import HomePage from './components/pages/HomePage';
import NewslatterPage from './components/pages/NewslatterPage';
import PricingPage from "./components/pages/PricingPage";
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import ProfilePage from './components/pages/ProfilePage';
import TrendingPage from './components/pages/TrendingPage';
import AssistantPage from './components/pages/AssistantPage';
import UserPage from "./components/pages/Admin/Users/AdminUserPage";
import ArticlePage from "./components/pages/Admin/Articles/ArticlePage"
import CreateArticlePage from './components/pages/Admin/Articles/CreateArticlePage';
import UpdateArticlePage from './components/pages/Admin/Articles/UpdateArticlePage';
import BenchmarkPage from './components/pages/Admin/Benchmarks/Benchmark';
import BenchmarkCreate from './components/pages/Admin/Benchmarks/BenchmarkCreate';
import BenchmarkUpdate from './components/pages/Admin/Benchmarks/BenchmarkUpdate';
import Dataset from "./components/pages/Admin/DataSets/Dataset"
import DatasetCreate from "./components/pages/Admin/DataSets/DatasetCreate"
import DatasetUpdate from "./components/pages/Admin/DataSets/DatasetUpdate"
import Dissertation from "./components/pages/Admin/Dissertations/Dissertations"
import DissertationCreate from "./components/pages/Admin/Dissertations/DissertationCreate"
import DissertationUpdate from "./components/pages/Admin/Dissertations/DissertationUpdate"
import Llm from "./components/pages/Admin/Llms/Llm"
import LlmCreate from "./components/pages/Admin/Llms/LlmCreate"
import LlmUpdate from "./components/pages/Admin/Llms/LlmUpdate"
import Tool from "./components/pages/Admin/Tools/Tool"
import ToolCreate from "./components/pages/Admin/Tools/ToolCreate"
import ToolUpdate from "./components/pages/Admin/Tools/ToolUpdate"
import Course from './components/pages/Admin/Courses/Course';
import CourseUpdate from './components/pages/Admin/Courses/CourseUpdate';
import CourseCreate from './components/pages/Admin/Courses/CourseCreate';
import UserUpdate from "./components/pages/Admin/Users/UserUpdate"
import NewsletterConfirm from './components/Newslatter/NewsletterConfirm';
import NewsletterUnsubscribe from './components/Newslatter/NewsletterUnsubscribe';

function App() {
  return (
    <Routes> {/* Router'ı burada kullanmıyoruz */}
      {/* Global MainLayout kullanımı */}
      <Route > {/* MainLayout'ı burada ekliyoruz */}
        <Route path="/" element={<HomePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/newsletter" element={<NewslatterPage />} />
        <Route path="/newsletter/confirm" element={<NewsletterConfirm />} />
        <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
        <Route path="/assistant" element={<AssistantPage />} />
      </Route>

      {/* Admin Layout ve Admin rotaları */}
      <Route path="/admin/*" >

        <Route path="users" element={<UserPage />} />
        <Route path="article" element={<ArticlePage />} />
        <Route path="article/create" element={<CreateArticlePage />} />
        <Route path="article/update/:id" element={<UpdateArticlePage />} />
        <Route path="benchmarks" element={<BenchmarkPage />} />
        <Route path="benchmarks/create" element={<BenchmarkCreate />} />
        <Route path="benchmark/update/:id" element={<BenchmarkUpdate />} />
        <Route path="datasets" element={<Dataset />} />
        <Route path="dataset/create" element={<DatasetCreate />} />
        <Route path="dataset/update/:id" element={<DatasetUpdate />} />
        <Route path="dissertations" element={<Dissertation />} />
        <Route path="dissertation/create" element={<DissertationCreate />} />
        <Route path="dissertation/update/:id" element={<DissertationUpdate />} />
        <Route path="llm" element={<Llm />} />
        <Route path="llm/create" element={<LlmCreate />} />
        <Route path="llm/update/:id" element={<LlmUpdate />} />
        <Route path="course" element={<Course />} />
        <Route path="course/update/:id" element={<CourseUpdate />} />
        <Route path="course/create" element={<CourseCreate />} />
        <Route path="tool" element={<Tool />} />
        <Route path="tool/create" element={<ToolCreate />} />
        <Route path='user/update/:id' element={<UserUpdate />} />
        <Route path="tool/update/:id" element={<ToolUpdate />} />
        {/* Diğer admin alt rotaları */}

      </Route>
    </Routes>
  );
}

export default App;
