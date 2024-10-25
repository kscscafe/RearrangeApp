import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/ProblemGroupSelection'; // 問題グループのコンポーネント
import './index.css'; // スタイルシート

const root = ReactDOM.createRoot(document.getElementById('root')); // 'root' IDのdivをターゲットに
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);