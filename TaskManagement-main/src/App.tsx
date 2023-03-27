import React from "react";
import AccountData from "./components/AccountSection/AccountData";
import Footer from "./components/Footer";
import Menu from "./components/Menu/Menu";
import TasksSection from "./components/TasksSection/TasksSection";
import ModalCreateTask from "./components/Utilities/ModalTask";
import { Task } from "./interfaces";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { modalActions } from "./store/Modal.store";
import { tasksActions } from "./store/Tasks.store";
// import { addFile, getFile } from "./ipfs";

// web3
import { ethers } from 'ethers';
import { contractAddress, contractABI } from './constant';

 
const App: React.FC = () => {

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

async function addTask(title: any, important: any, date: any) { 


  if (typeof window.ethereum !== 'undefined') { 

      await requestAccount(); 

      const provider = new ethers.providers.Web3Provider(window.ethereum); 

      const signer = provider.getSigner(); 

      const contract = new ethers.Contract( 

          contractAddress, 

          contractABI, 

          signer 

      ); 

      
      const transaction = await contract.addTask(title, (new Date(date).getTime() / 1000), "0x0000000000000000000000000000000000000000000000000000000000000000", important); 

      await transaction.wait(); 

  } 

} 

  const modal = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();

  const closeModalCreateTask = () => {
    dispatch(modalActions.closeModalCreateTask());
  };

  const createNewTaskHandler = async (task: Task) => {

    await addTask(task.title, task.important, task.date);
    dispatch(tasksActions.addNewTask(task));
  };

  return (
    <div className="bg-slate-200 min-h-screen text-slate-600 dark:bg-slate-900 dark:text-slate-400 xl:text-base sm:text-sm text-xs">
      {modal.modalCreateTaskOpen && (
        <ModalCreateTask
          onClose={closeModalCreateTask}
          nameForm="Add a task"
          onConfirm={createNewTaskHandler}
        />
      )}
      <Menu />
      <TasksSection />
      <Footer />
      <AccountData />
    </div>
  );
};

export default App;
