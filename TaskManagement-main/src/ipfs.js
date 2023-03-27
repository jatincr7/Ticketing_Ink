import IPFS from 'ipfs-http-client';

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


console.log("IPFS")
// Add file to IPFS
export const addFile = async (file) => {
  try {
    const added = await ipfs.add(file);
    console.log('File added to IPFS:', added.cid.toString());
    return added.cid.toString();
  } catch (error) {
    console.log('Error adding file to IPFS:', error);
  }
};

// Get file from IPFS
export const getFile = async (cid) => {
  try {
    const file = await ipfs.get(cid);
    console.log('File retrieved from IPFS:', file);
    return file;
  } catch (error) {
    console.log('Error getting file from IPFS:', error);
  }
};
