import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import pinyin from 'pinyin'; // Pinyinライブラリをインポート

const RearrangeSentence = ({ group }) => {
    const [selectedWords, setSelectedWords] = useState([]);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [resultSymbol, setResultSymbol] = useState(null);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [shuffledProblems, setShuffledProblems] = useState([]);
    const [shuffledWords, setShuffledWords] = useState([]);
    const [showTranslation, setShowTranslation] = useState(true); // 日本語訳のオン/オフ

    // 問題をシャッフル
    useEffect(() => {
        const shuffled = [...group.problems].sort(() => Math.random() - 0.5);
        setShuffledProblems(shuffled);
        setCurrentProblemIndex(0); // 最初の問題インデックスをリセット
        setSelectedWords([]); // 選択された単語をリセット
        setIsConfirmed(false); // 確認フラグをリセット
        setResultSymbol(null); // 結果シンボルをリセット
    }, [group]);

    const currentProblem = shuffledProblems[currentProblemIndex]; // シャッフルされた問題から現在の問題を取得

    // 問題が変更されたときに単語をシャッフル
    useEffect(() => {
        if (currentProblem) {
            const allWords = [...currentProblem.correctOrder]; // 正解の単語
            const shuffled = allWords.sort(() => Math.random() - 0.5); // ランダム化
            setShuffledWords(shuffled); // シャッフルした単語を保存
        }
    }, [currentProblem]);

    const toggleWordSelection = (word) => {
        setSelectedWords(prev => {
            if (prev.includes(word)) {
                return prev.filter(w => w !== word); // タップした場合は選択解除
            } else {
                return [...prev, word]; // タップした場合は選択追加
            }
        });

        // 読み上げ機能（特定の文字を除外）
        if (!['?', '!', '？', '！'].includes(word)) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'zh-CN'; // 中国語を設定
            window.speechSynthesis.speak(utterance); // 読み上げ
        }
    };

    const checkAnswer = () => {
        if (selectedWords.join(',') === currentProblem.correctOrder.join(',')) {
            setResultSymbol('⚪︎'); // 正解のシンボル
        } else {
            setResultSymbol('×'); // 不正解のシンボル
        }
        setIsConfirmed(true);
    };

    const nextProblem = () => {
        if (currentProblemIndex < shuffledProblems.length - 1) {
            setCurrentProblemIndex(prev => prev + 1);
            setSelectedWords([]);
            setIsConfirmed(false);
            setResultSymbol(null);
            setShuffledWords([]); // 次の問題に進んだらシャッフルをリセット
        } else {
            // 最後の問題が終わった場合、結果を表示
            alert("全ての問題が終了しました！"); // 結果を表示
        }
    };

    // 音声を再生する関数
    const playAudio = () => {
        if (currentProblem && currentProblem.audio) {
            const audio = new Audio(currentProblem.audio);
            audio.play();
        }
    };

    // Pinyinを生成する関数
    const generatePinyin = (words) => {
        return words.map(word => pinyin(word, { style: pinyin.STYLE_TONE }).join('')); // 各単語のPinyinを生成
    };

    // 日本語訳の表示を切り替える関数
    const toggleTranslation = () => {
        setShowTranslation(prev => !prev);
    };

    // ホームに戻る関数
    const goHome = () => {
        window.location.href = 'https://www.officees.co.jp/webapp/'; // 指定のURLにリダイレクト
    };

    return (
        <div>
            {/* Xボタン（ホームに戻るボタン）を左上に設置 */}
            <div style={{ position: 'fixed', top: '10px', left: '10px', cursor: 'pointer' }} onClick={goHome}>
                <FontAwesomeIcon icon={faCircleXmark} size="lg" />
            </div>

            {/* 問題数と出題順を表示 */}
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    {/* 日本語訳の表示をオンにした場合のみ表示 */}
                    {showTranslation && currentProblem
                        ? currentProblem.translation 
                        : '聞こえたとおりにタップしてください'}
                    {/* 再生ボタンを日本語訳のすぐ右側に表示 */}
                    {currentProblem && currentProblem.audio && (
                        <i 
                            className="fa-solid fa-circle-play" 
                            style={{ cursor: 'pointer', marginLeft: '10px' }} 
                            onClick={playAudio} // 音声再生をトリガー
                        ></i>
                    )}
                </span>
                <span>({currentProblemIndex + 1}/{shuffledProblems.length})</span>
            </h2>
            <div style={{ 
                backgroundColor: 'white', 
                padding: '10px', 
                borderRadius: '5px',
                border: '2px solid #f0f0f0', 
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)', 
                minHeight: '60px', 
                display: 'flex',
                alignItems: 'center' 
            }}>
                {selectedWords.join('')} 
                {isConfirmed && (
                    <div>
                        <p style={{ color: 'red', fontSize: '20px' }}>{resultSymbol}</p>
                        {resultSymbol === '×' && (
                            <p style={{ color: 'red' }}>正解: {currentProblem.correctOrder.join('')}</p>
                        )}
                    </div>
                )}
            </div>
            <div>
                {shuffledWords.map((word, index) => (
                    <div key={index} style={{ display: 'inline-block', margin: '5px', textAlign: 'center' }}>
                        <div style={{ color: 'gray', fontSize: '0.8em' }}>
                            {generatePinyin([word])[0]} 
                        </div>
                        <button
                            onClick={() => toggleWordSelection(word)}
                            style={{
                                backgroundColor: selectedWords.includes(word) ? 'lightgreen' : 'lightblue',
                                color: 'black', // 文字色を黒に設定
                                fontSize: '20px', // ボタンの文字サイズを指定
                                padding: '10px 15px', // ボタンのパディングを設定
                                border: 'none', // 枠線を無しに
                                borderRadius: '5px' // 角を丸くする
                            }}
                        >
                            {word}
                        </button>
                    </div>
                ))}
            </div>
            <div className="fixed-button-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button onClick={isConfirmed ? nextProblem : checkAnswer} style={{ fontSize: '18px' }}>
                    {isConfirmed ? '次へ' : '確定'}
                </button>
            </div>

            {/* 日本語訳オン/オフスイッチを画面の左下に配置 */}
            <div style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        checked={showTranslation}
                        onChange={toggleTranslation}
                        style={{ marginRight: '8px' }}
                    />
                    日本語訳を表示
                </label>
            </div>
        </div>
    );
};

export default RearrangeSentence;