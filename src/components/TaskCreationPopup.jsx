import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "react-modal";
import { ask } from "../Chat";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { toast,Toaster } from "react-hot-toast"; 
import Dropdown from "./Dropdown";

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
    const columnId = selectedTask
      ? selectedTask.columnId
        ? selectedTask.columnId
        : null
      : null;
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
      toast.success("Subtasks generated successfully!");
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
      className="grid grid-cols-3 w-2/3"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Task Creation Popup"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
        <Toaster /> 
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
        <Dropdown options={["Dev", "Qa", "UnitTest"]} />
        <div className="flex justify-end gap-4 mr-5">
          <a
            href="#_"
            onClick={handleSubmit}
            className="relative inline-flex items-center justify-start px-12 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
          >
            <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out ">
              {selectedTask ? "Update" : "Create"}
            </span>
          </a>
          <a
            href="#_"
            onClick={generateSubtask}
            className="relative inline-flex items-center justify-start px-12 py-3 overflow-hidden font-medium transition-all bg-purple-600 rounded  group hover:text-black"
          >
            <span className="relative text-black transition duration-300 text-white ease">
              Generate Subtask
            </span>
          </a>
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
        <div className="flex flex-col gap-8">
          <div>
            <h1>Status</h1>
            <Dropdown options={["Todo", "In Progress", "Done"]} />
          </div>
          <div>
            <h1>Priority</h1>
            <Dropdown options={["Low", "Medium", "High"]} />
          </div>
          <div>
            <h1>Asignee</h1>
            <Dropdown
              options={["Akhil Kumar Singh", "Darsh Patel", "Paras Rawat"]}
            />
          </div>
          <div>
            <h1>Reporter</h1>
            <Dropdown options={["Priyanshu Dixit"]} />
          </div>
          <div>
            <div>
              {/* <p>
                Created At:
                {new Date()
                  .toLocaleString("en-IN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                  .replace(",", "")}
              </p>
              <p>
                Updated At:
                {new Date()
                  .toLocaleString("en-IN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                  .replace(",", "")}
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
