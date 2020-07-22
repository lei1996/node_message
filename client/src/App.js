import React, { useContext } from "react";
import { Router, Link } from "@reach/router";
import socket from './socket';

const Home = () => (
  <div>
    <h1>Home测试路由</h1>
    <nav>
      <Link to="/">Home</Link> | <Link to="dashboard">Dashboard</Link>
    </nav>
  </div>
);

const Dash = () => <div>Dash <Link to="/">Home</Link> | <Link to="dashboard">Dashboard</Link></div>;

import { css } from "linaria";
import avatar from "./assets/img/0.jpg";

const header = css`
  font-size: 26px;
  font-weight: 'blod';
`;

console.log("dev模式才会显示该console.log");

const ImgTest = () => {
  return (
    <h1 className={header}>
      Hello from react
      <img src={avatar} />
    </h1>
  );
};

// useLocalStore 用于获取 Store 对象实例
import { observer, useLocalStore } from "mobx-react-lite";

// MoviesStoreContext 在 Movies-mobx 文件创建的 上下文
import MoviesStoreContext, { MoviesStore } from "./Movies-mobx";

// 根据传入的score 返回几颗星
const Ratings = observer(function Ratings({ score }) {
  return <div>{["⭐", "⭐", "⭐", "⭐", "⭐"].splice(0, score)}</div>;
});

// Movie 组件
const Movie = observer(function Movie({ movie }) {
  // 用react 的 useContext 获取 MoviesStoreContext 上下文 以此免除 props 参数的传递过程
  const { addToQueue, like, dislike } = useContext(MoviesStoreContext);
  console.log("render", movie);

  return (
    <div>
      {addToQueue && (
        <>
          <button onClick={() => addToQueue(movie)}>Add to Queue</button>
          <button onClick={() => like(movie)}>Like</button>
          <button onClick={() => dislike(movie)}>Dislike</button>
        </>
      )}
      <div>{movie.Title}</div>
      <img src={movie.Poster} />
      {like && <Ratings score={movie.score} />}
    </div>
  );
});

const Movies = observer(function Movies() {
  // 用react 的 useContext 获取 MoviesStoreContext 上下文 以此免除 props 参数的传递过程
  const { movies } = useContext(MoviesStoreContext);

  return (
    <div className="movies">
      {movies.map((m) => (
        <Movie key={m.imdbID} movie={m} />
      ))}
    </div>
  );
});

// Queue 列表
const Queue = observer(function Queue() {
  // 用react 的 useContext 获取 MoviesStoreContext 上下文 以此免除 props 参数的传递过程
  const { queue } = useContext(MoviesStoreContext);

  return (
    <div className="queue">
      {queue.map((m) => (
        <Movie key={m.imdbID} movie={m} />
      ))}
    </div>
  );
});

const App = observer(function App() {
  // mobx useLocalStore 获取 Store 对象实例
  const store = useLocalStore(MoviesStore);
  const { fetchAll } = store;

  return (
    // 全局注入context 就可以不用一层一层 传递store 里面的 属性 或 方法
    <MoviesStoreContext.Provider value={store}>
      <div className="App">
        <ImgTest />

        <Router>
          <Home path="/" />
          <Dash path="dashboard" />
        </Router>
        <button onClick={fetchAll}>Fetch</button>
        <Movies />
        <Queue />
      </div>
    </MoviesStoreContext.Provider>
  );
});

export default App;
