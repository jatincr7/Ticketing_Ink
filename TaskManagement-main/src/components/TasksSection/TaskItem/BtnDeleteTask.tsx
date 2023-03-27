import React, { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { tasksActions } from "../../../store/Tasks.store";
import ModalConfirm from "../../Utilities/ModalConfirm";
import { ReactComponent as Trash } from "../../../assets/trash.svg";

// web3
import { ethers } from 'ethers';
import { contractAddress, contractABI } from './../../../constant';

 

async function requestAccount() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
}

async function deleteTask(id: any) { 


  if (typeof window.ethereum !== 'undefined') { 

      await requestAccount(); 

      const provider = new ethers.providers.Web3Provider(window.ethereum); 

      const signer = provider.getSigner(); 

      const contract = new ethers.Contract( 

          contractAddress, 

          contractABI, 

          signer 

      ); 

      const transaction = await contract.deleteTask(id); 

      await transaction.wait(); 

 

  } 

} 

const BtnDeleteTask: React.FC<{ taskId: string }> = ({ taskId }) => {
  const [showModal, setIsModalShown] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const removeTaskHandler = async () => {

    await deleteTask(0);
    dispatch(tasksActions.removeTask(taskId));
  };
  return (
    <>
      {showModal && (
        <ModalConfirm
          onClose={() => setIsModalShown(false)}
          text="This task will be deleted permanently."
          onConfirm={removeTaskHandler}
        />
      )}
      <button
        onClick={() => setIsModalShown(true)}
        title="delete task"
        className="ml-2 transition hover:text-slate-700 dark:hover:text-slate-200"
      >
        <Trash className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </>
  );
};

export default React.memo(BtnDeleteTask);
