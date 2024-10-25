import React from 'react';
import ProblemGroupSelection from './ProblemGroupSelection';
import RearrangeSentence from './RearrangeSentence';

const App = () => {
    const [selectedGroup, setSelectedGroup] = React.useState(null);

    return (
        <div>
            {selectedGroup ? (
                <RearrangeSentence group={selectedGroup} />
            ) : (
                <ProblemGroupSelection onSelectGroup={setSelectedGroup} />
            )}
        </div>
    );
};

export default App;