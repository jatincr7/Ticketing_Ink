import React from "react";
import { useAppDispatch } from "../../../store/hooks";
import { tasksActions } from "../../../store/Tasks.store";
import { ReactComponent as StarLine } from "../../../assets/star-line.svg";

// web3
import { ethers } from 'ethers';
import { contractAddress, contractABI } from './../../../constant';

async function requestAccount() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
} 

async function toggleImportant(id: any) { 


  if (typeof window.ethereum !== 'undefined') { 

      await requestAccount(); 

      const provider = new ethers.providers.Web3Provider(window.ethereum); 

      const signer = provider.getSigner(); 

      const contract = new ethers.Contract( 

          contractAddress, 

          contractABI, 

          signer 

      ); 
      
      const transaction = await contract.toggleImportant(id); 
      
      await transaction.wait();  
      

  } 

} 

const BtnMarkAsImportant: React.FC<{
  taskId: string;
  taskImportant: boolean;
}> = ({ taskId, taskImportant }) => {
  const dispatch = useAppDispatch();

  const markAsImportantHandler = () => {
    dispatch(tasksActions.markAsImportant(taskId));
  };

  return (
    <button
      title={taskImportant ? "unmark as important" : "mark as important"}
      onClick={async ()=>{
        await toggleImportant(0)
        markAsImportantHandler()
      }
      }
      className="transition hover:text-slate-700 dark:hover:text-slate-200 ml-auto"
    >
      <StarLine
        className={`w-5 h-5 sm:w-6 sm:h-6 ${
          taskImportant ? "fill-rose-500 stroke-rose-500 " : "fill-none"
        }`}
      />
    </button>
  );
};

export default React.memo(BtnMarkAsImportant);
