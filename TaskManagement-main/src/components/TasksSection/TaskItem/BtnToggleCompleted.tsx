import React from "react";
import { useAppDispatch } from "../../../store/hooks";
import { tasksActions } from "../../../store/Tasks.store";
import { ReactComponent as SvgX } from "../../../assets/x.svg";
import { ReactComponent as Check } from "../../../assets/check.svg";

// web3
import { ethers } from 'ethers';
import { contractAddress, contractABI } from './../../../constant';

async function requestAccount() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
} 

async function completeTask(id: any) { 


  if (typeof window.ethereum !== 'undefined') { 

      await requestAccount(); 

      const provider = new ethers.providers.Web3Provider(window.ethereum); 

      const signer = provider.getSigner(); 

      const contract = new ethers.Contract( 

          contractAddress, 

          contractABI, 

          signer 

      ); 
      
      const transaction = await contract.completeTask(id); 
      
      await transaction.wait();  
      

  } 

} 

const BtnToggleCompleted: React.FC<{
  taskCompleted: boolean;
  taskId: string;
  isListInView1: boolean;
}> = ({ taskCompleted, taskId, isListInView1 }) => {
  const dispatch = useAppDispatch();

  const toggleTaskCompleted = (id: string) => {

    dispatch(tasksActions.toggleTaskCompleted(id));

  };


  
  return (
    <button
      title={taskCompleted ? "mark as uncompleted" : "mark as completed"}
      className={`${
        taskCompleted
          ? "bg-emerald-200 text-emerald-800 "
          : "bg-amber-200 text-amber-800 "
      } ${isListInView1 ? "mr-4" : "mr-4 order-0"} rounded-full font-medium`}
      onClick={async () => {
        await completeTask(0);
        toggleTaskCompleted(taskId)
      } 
      }
    >
      <span className="block py-1 px-3 absolute invisible sm:static sm:visible">
        {taskCompleted ? "completed" : "uncompleted"}
      </span>
      <span className=" sm:hidden w-6 h-6 grid place-items-center">
        {taskCompleted ? (
          <Check className="w-3 h-3" />
        ) : (
          <SvgX className="w-3 h-3" />
        )}
      </span>
    </button>
  );
};

export default React.memo(BtnToggleCompleted);
