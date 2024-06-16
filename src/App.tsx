// import { useState } from 'react';
// import './App.css';
// import { ask } from './Chat';

// function App() {
//   const [title, setTitle] = useState('Deletion of user on User Platform');
//   const [description, setDescription] = useState(`
//     As a FrontEnd Developer, I want to integrate Rest API endpoints to our platform's
//     for the deletion of a user. A proper notification should be shown on top after deletion of the user.
//     Message: 'User has been deleted successfully'.
//     All details attached below.
//     Endpoint:
//     API: https://exampleapi.api/
//     Figma Link: https://figmaexample/21314kldkasldjoasdad.com
//   `);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [storyPoints, setStoryPoints] = useState(2);
//   const [subtasks, setSubtasks] = useState<any | null>(null);

//   function openModal() {
//     setModalIsOpen(true);
//   }

//   function closeModal() {
//     setModalIsOpen(false);
//   }

//   async function generate() {
//     const res = await ask(title, description, storyPoints);
//     setSubtasks(res.subtasks); // Store the response's subtasks in the state
//     closeModal(); // Close the modal
//     console.log(res.subtasks);
//   }

//   return (
//     <div className="app-container">
// <div className='main-story'>
//       <div className="card">
//         <h2>{title}</h2>
//         <p>{description}</p>
//         <button onClick={openModal}>Generate</button>
//       </div>
//       </div>
//       {/* Display the generated subtasks on the main screen */}
//       {subtasks && (
//         <div className="subtasks">
        
//           {Object.keys(subtasks).map((key) => (
//             <div key={key} className="subtask-card">
//               <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
//               <p><strong>Title:</strong> {subtasks[key].title}</p>
//               <p><strong>Description:</strong> {subtasks[key].description}</p>
//               <p><strong>Story Points:</strong> {subtasks[key].storyPoints}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {modalIsOpen && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h2>Generate Subtasks</h2>
//             <label htmlFor="title">Title:</label>
//             <input
//               type="text"
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <label htmlFor="description">Description:</label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//             <label htmlFor="storyPoints">Story Points:</label>
//             <input
//               type="number"
//               id="storyPoints"
//               value={storyPoints}
//               onChange={(e) => setStoryPoints(Number(e.target.value))}
//             />
//             <button onClick={generate}>Generate</button>
//             <button onClick={closeModal}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// App.js

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <div className="app">
      <Sidebar />
        <Board />
      <div className="main-content">
        <Header />
      </div>
    </div>
  );
}

export default App;