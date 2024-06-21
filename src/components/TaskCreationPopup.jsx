import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "react-modal";
import { ask } from "../Chat";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon } from "@heroicons/react/16/solid";

export default function TaskCreationPopup({
  isOpen,
  onClose,
  onSubmit,
  selectedTask,
  storyType,
  setStoryType,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoints, setStoryPoints] = useState(0);

  const handleSubmit = () => {
    const id = selectedTask ? selectedTask.id : `task-${uuidv4()}`;
    const columnId = selectedTask ? selectedTask.columnId ? selectedTask.columnId : null : null;
    onSubmit({ id, title, description, storyPoints, storyType, columnId });
    setTitle("");
    setDescription("");
    setStoryPoints(0);
  };
  const generateSubtask = async () => {
    console.log(selectedTask.id);

    try {
      const res = await ask(title, description, storyPoints);
      const { development, unitTestscase, qa } = res.subtasks;
      const updatedUnitTestscase = {
        ...unitTestscase,
        description: res.unitTest.scenarios,
      };
      const updatedQaScenerios = {
        ...qa,
        description: res.functionalTesting.scenarios,
      };

      // Create an array of subtasks
      const subtasks = [
        { ...development, parentId: selectedTask.id, storyType: "Dev" },
        {
          ...updatedUnitTestscase,
          parentId: selectedTask.id,
          storyType: "UnitTest",
        },
        { ...updatedQaScenerios, parentId: selectedTask.id, storyType: "Qa" },
      ];

      // Sequentially create tasks
      for (let subtask of subtasks) {
        let randomNumber = Math.floor(Math.random() * 1000);
        let paddedNumber = randomNumber.toString().padStart(3, "0");
        let randomRDP = `task-${paddedNumber}`;

        const taskData = {
          parentId: selectedTask.id,
          id: randomRDP,
          title: subtask.title,
          description: subtask.description,
          storyPoints: subtask.storyPoints.toString(),
          storyType: subtask.storyType, // Assuming storyType is development, unitTestscase, or qa
        };

        onSubmit(taskData); // Wait for task creation to complete
      }
    } catch (error) {
      console.error("Error creating subtasks:", error);
    }
  };
  React.useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setStoryPoints(parseInt(selectedTask.storyPoints) || 0);
      setStoryType(selectedTask.storyType || "Dev");
    } else {
      setTitle("");
      setDescription("");
      setStoryPoints(0);
      setStoryType("Dev");
    }
  }, [selectedTask, setStoryType]);

  return (
    <Modal
      className="w-fit grid grid-cols-3"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Task Creation Popup"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <div className="col-span-2">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2>{selectedTask ? "Edit Task" : "Create New Task"}</h2>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={7}
          cols={50}
        />
        <input
          type="number"
          value={storyPoints}
          onChange={(e) => setStoryPoints(parseInt(e.target.value))}
          placeholder="Story Points"
        />
        <select
          value={storyType}
          onChange={(e) => setStoryType(e.target.value)}
          style={{ marginBottom: "20px" }}
        >
          <option value="Dev">Dev</option>
          <option value="Qa">QA</option>
          <option value="UnitTest">Unit Test</option>
        </select>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button onClick={handleSubmit}>
            {selectedTask ? "Update" : "Create"}
          </button>
          <button onClick={generateSubtask}>Generate Subtask</button>
        </div>

        <div className="comments text-white py-4">
          <h3>Comments</h3>
          <div className="flex gap-4">
            <img
              className="rounded-full w-12 h-12"
              src="https://jira-clone.fly.dev/avatars/jessie-min.webp"
              alt="user-img"
            />

            <div>
              <textArea placeholder="Add your comment...."></textArea>
              <button className="save text-sm">Save</button>
              <button className="cancel text-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-white">
        <p className="cancel float-end" onClick={onClose}>
          <XMarkIcon width={25} height={25} />
        </p>
        <div>
          <h1>Status</h1>
          <select
            className="darkTheme"
            // value={storyType}
            // onChange={(e) => setStoryType(e.target.value)}
            style={{ marginBottom: "20px" }}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progess</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <h1>Priority</h1>
          <select
            className="darkTheme"
            // value={storyType}
            // onChange={(e) => setStoryType(e.target.value)}
            style={{ marginBottom: "20px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <h1>Asignee</h1>
          <select
            className="darkTheme"
            // value={storyType}
            // onChange={(e) => setStoryType(e.target.value)}
            style={{ marginBottom: "20px" }}
          >
            <option value="akhil">Akhil Kumar Singh</option>
            <option value="darsh">Darsh Patel</option>
            <option value="paras">Paras Rawat</option>
          </select>
        </div>
        <div>
          <h1>Reporter</h1>
          <select
            className="darkTheme"
            // value={storyType}
            // onChange={(e) => setStoryType(e.target.value)}
            style={{ marginBottom: "20px" }}
          >
            <option value="priyanshu">Priyanshu Dixit</option>
          </select>
        </div>
        <div>
          <div>
            <label>Created At:</label>
            <label>Updated At:</label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
