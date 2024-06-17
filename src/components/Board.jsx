import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import './Board.css';
import { ask } from '../Chat'
import { v4 as uuidv4 } from 'uuid';
 
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Deletion of user on User Platform', description: 'User have been deleted successfully All details attached below Endpoint APi: https://exmapleapi.api/ Figma Link: https://figmaexample/2joasdad.com', storyPoints: '2', storyType: 'dev' },
    'task-2': { id: 'task-2', title: 'title', description: 'create a post', storyPoints: '3', storyType: 'qa' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'TO DO',
      taskIds: ['task-1'],
    },
    'column-2': {
      id: 'column-2',
      title: 'IN PROGRESS',
      taskIds: ['task-2'],
    },
    'column-3': {
      id: 'column-3',
      title: 'DONE',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};
 
function Board() {
  const [state, setState] = useState(initialData);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState('column-1');
  const [selectedTask, setSelectedTask] = useState(null);
  const [storyType, setStoryType] = useState('dev'); // Added state for story type
 
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
 
    if (!destination) {
      return;
    }
 
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
 
    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];
 
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
 
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
 
      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
 
      setState(newState);
      return;
    }
 
    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };
 
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
 
    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setState(newState);
  };
 
  const onAddTask = (columnId) => {
    setActiveColumn(columnId);
    setSelectedTask(null);
    setIsPopupOpen(true);
  };
 
  const onTaskClick = (task) => {
    setSelectedTask(task);
    setIsPopupOpen(true);
  };
 
  const handleCreateTask = (taskData) => {
    const newTaskId = `task-${uuidv4()}`;
    console.log(taskData);
    const newTask = {
      id: newTaskId,
      title: taskData.title,
      description: taskData.description,
      storyPoints: taskData.storyPoints.toString(),
      storyType: taskData.storyType,
    };
 
    // Check if activeColumn is defined
    if (!activeColumn) {
      console.error("activeColumn is not defined");
      return;
    }
 
    // Check if the active column exists in the state
    const activeColumnData = state.columns[activeColumn];
    if (!activeColumnData) {
      console.error(`Column with id ${activeColumn} does not exist`);
      return;
    }
 
    setState((prevState) => {
      const newState = {
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...prevState.columns,
          [activeColumn]: {
            ...prevState.columns[activeColumn],
            taskIds: [...prevState.columns[activeColumn].taskIds, newTaskId],
          },
        },
      };
      return newState
    })
 
    // setState(newState);
    setIsPopupOpen(false);
  };
 
 
  return (
    <div className="board">
      <div className="board-header">
        <h2>Board</h2>
        <div className="board-actions">
          <div className="user-avatars">
            {/* Add user avatars here */}
          </div>
          <button className="filter-button">Filter issues</button>
          <button className="sort-button">Sort by date</button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
 
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onAddTask={onAddTask}
                onTaskClick={onTaskClick}
              />
            );
          })}
        </div>
      </DragDropContext>
      <TaskCreationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleCreateTask}
        selectedTask={selectedTask}
        storyType={storyType} // Pass story type
        setStoryType={setStoryType} // Pass setStoryType function
      />
    </div>
  );
}
 
function Column({ column, tasks, onAddTask, onTaskClick }) {
  return (
    <div className="column">
      <h3>{column.title} ({tasks.length})</h3>
      <button className="add-task-button" onClick={() => onAddTask(column.id)}>+</button>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="task-list"
          >
            {provided.placeholder}
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} onTaskClick={onTaskClick} />
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
}
 
function Task({ task, index, onTaskClick }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="card"
          onClick={() => onTaskClick(task)}
        >
          <p>{task.title}</p>
          <p>{task.description}</p>
          {task.storyPoints && <span className="card-id">{task.storyPoints}</span>}
          <span className="card-story-type">{task.storyType}</span>
        </div>
      )}
    </Draggable>
  );
}
 
function TaskCreationPopup({ isOpen, onClose, onSubmit, selectedTask, storyType, setStoryType }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [storyPoints, setStoryPoints] = useState(0);
 
  const handleSubmit = () => {
    onSubmit({ title, description, storyPoints, storyType });
    setTitle('');
    setDescription('');
    setStoryPoints(0);
  };
  const generateSubtask = async () => {
    console.log(selectedTask.id);
 
    try {
      const res = await ask(title, description, storyPoints);
      const { development, unitTestscase, qa } = res.subtasks;
 
      // Create an array of subtasks
      const subtasks = [
        { ...development, parentId: selectedTask.id, storyType: 'development' },
        { ...unitTestscase, parentId: selectedTask.id, storyType: 'unitTestscase' },
        { ...qa, parentId: selectedTask.id, storyType: 'qa' }
      ];
 
      // Sequentially create tasks
      for (let subtask of subtasks) {
        let randomNumber = Math.floor(Math.random() * 1000);
        let paddedNumber = randomNumber.toString().padStart(3, '0');
        let randomRDP = `RDP-${paddedNumber}`;
 
        const taskData = {
          id: randomRDP,
          title: subtask.title,
          description: subtask.description,
          storyPoints: subtask.storyPoints.toString(),
          storyType: subtask.storyType // Assuming storyType is development, unitTestscase, or qa
        };
 
        onSubmit(taskData); // Wait for task creation to complete
      }
    } catch (error) {
      console.error('Error creating subtasks:', error);
    }
  };
  React.useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setStoryPoints(parseInt(selectedTask.storyPoints) || 0);
      setStoryType(selectedTask.storyType || 'dev');
    } else {
      setTitle('');
      setDescription('');
      setStoryPoints(0);
      setStoryType('dev');
    }
  }, [selectedTask, setStoryType]);
 
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Task Creation Popup">
      <h2>{selectedTask ? 'Edit Task' : 'Create New Task'}</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="number" value={storyPoints} onChange={(e) => setStoryPoints(parseInt(e.target.value))} placeholder="Story Points" />
      <select value={storyType} onChange={(e) => setStoryType(e.target.value)}>
        <option value="dev">Dev</option>
        <option value="qa">QA</option>
        <option value="unit-test">Unit Test</option>
      </select>
      <button onClick={handleSubmit}>{selectedTask ? 'Update' : 'Create'}</button>
      <button onClick={onClose}>Cancel</button>
      <button onClick={generateSubtask}>Generate Subtask</button>
    </Modal>
  );
}
 
export default Board;
 