import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "react-modal";
import "./Board.css";
import { ask } from "../Chat";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { PriorityIcon } from "../PriorityIcon";
import TaskCreationPopup from "./TaskCreationPopup.jsx";
const initialData = {
  tasks: {
    "Task-1": {
      id: "Task-1",
      storyId: "RDP-234",
      title: "Create a Multiple Choice Question",
      description: `As an educator, I want to create a multiple choice question using the Quiz Creation Tool so that I can assess my students' understanding of the material in a straightforward and effective manner.
Acceptance Criteria:
1.The user can access the "Create Question" interface.
2.The user can select "Multiple Choice" as the question type.
3.The user can input the question text and multiple answer options.
4.The user can mark one or more correct answers.
5.The user can add multimedia elements (images, videos) to the question if desired.
6.The user can save the question to be included in a quiz.`,
      storyPoints: "2",
      storyType: "Dev",
      priority: "high",
    },
    "Task-2": {
      id: "Task-2",
      storyId: "RDP-234",
      title: "Mark Task as Completed",
      description: `
      As a marketer, I want to customize the quiz theme so that the quiz aligns with my brand's identity.
Acceptance Criteria:
The user can access the "Customize Theme" interface.
The user can choose from pre-designed themes.
The user can upload custom backgrounds, logos, and select color schemes.
The customized theme is applied to the quiz interface.
      `,
      storyPoints: "3",
      storyType: "Dev",
      priority: "low",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "TO DO",
      taskIds: ["Task-1"],
    },
    "column-2": {
      id: "column-2",
      title: "IN PROGRESS",
      taskIds: ["Task-2"],
    },
    "column-3": {
      id: "column-3",
      title: "DONE",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

function Board() {
  const [state, setState] = useState(initialData);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState("column-1");
  const [selectedTask, setSelectedTask] = useState(null);
  const [storyType, setStoryType] = useState("Dev"); // Added state for story type

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

  const handleCreateTask = async (taskData) => {
    const newTaskId = taskData.id;
    const newTask = {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      storyPoints: taskData.storyPoints.toString(),
      storyType: taskData.storyType,
      ...(taskData.parentId && { parentId: taskData.parentId }),
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
            taskIds: [
              ...prevState.columns[activeColumn].taskIds.filter(
                (item) => item != newTaskId
              ),
              newTaskId,
            ],
          },
        },
      };
      return newState;
    });

    // setState(newState);

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      console.log("Task saved successfully");
    } catch (error) {
      console.error("Error saving task:", error);
    }

    setIsPopupOpen(false);
  };

  return (
    <div className="board">
      <div className="board-header">
        <h2 style={{ color: "white" }}>Board</h2>
        <div className="board-actions">
          <div className="user-avatars">{/* Add user avatars here */}</div>
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
      <h3>
        {column.title} ({tasks.length})
      </h3>
      <button className="add-task-button" onClick={() => onAddTask(column.id)}>
        +
      </button>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="task-list"
          >
            {provided.placeholder}
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                onTaskClick={onTaskClick}
              />
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
          {task.parentId && <p>Subtask of {task.parentId}</p>}
          <p className="fw-600">{task.id}</p>
          <p>{task.title}</p>
          <p className="card-desc">{task.description}</p>
          {task.storyPoints && (
            <span className="card-id">{task.storyPoints}</span>
          )}
          <div className="d-flex flex-end">
            <span className="card-story-type">{task.storyType}</span>
            {PriorityIcon(task.priority)}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Board;
