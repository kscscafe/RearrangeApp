import React, { useState } from 'react';
import { problemGroups } from '../data/ProblemData';
import RearrangeSentence from './RearrangeSentence';

const ProblemGroupSelection = () => {
    const [selectedGroup, setSelectedGroup] = useState(null); // 選択した問題グループの状態

    const handleSelectGroup = (group) => {
        setSelectedGroup(group); // グループを選択
    };

    return (
        <div>
             <h1 style={{ textAlign: 'center' }}>例文並び替え練習</h1> {/* 中央揃えに設定 */}
            {selectedGroup ? (
                // 問題グループが選択された場合に問題を表示
                <RearrangeSentence group={selectedGroup} />
            ) : (
                // 問題グループが選択されていない場合にボタンを表示
                problemGroups.map((group, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleSelectGroup(group)}
                        style={{
                            fontSize: '18px', // ボタンの文字サイズを設定
                            padding: '10px 20px', // ボタンのパディングを設定
                            margin: '10px', // ボタンのマージンを設定
                            backgroundColor: '#007bff', // ボタンの背景色
                            color: 'white', // ボタンの文字色
                            border: 'none', // ボーダーを無しに
                            borderRadius: '5px', // 角を丸くする
                            cursor: 'pointer', // カーソルをポインターに
                        }}
                    >
                        {group.name}
                    </button>
                ))
            )}
        </div>
    );
};

export default ProblemGroupSelection;