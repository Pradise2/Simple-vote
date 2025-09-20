import { useAccount, useReadContract } from 'wagmi';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../constants';
import CreateProposalForm from '../components/admin/CreateProposalForm';

const AdminPage = () => {
  const { address, isConnected } = useAccount();

  // Fetch the contract owner's address
  const { data: ownerAddress, isLoading } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'owner',
  });

  if (!isConnected) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="mt-4 text-gray-400">Please connect your wallet to access the admin panel.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center">Verifying admin status...</div>;
  }
  
  // Check if the connected user is the owner
  const isOwner = address && ownerAddress && address === ownerAddress;

  if (!isOwner) {
    return (
      <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg">
        <h2 className="text-2xl font-bold text-red-300">Access Denied</h2>
        <p className="mt-4 text-red-400">You are not the contract owner. This area is restricted.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <CreateProposalForm />
    </div>
  );
};

export default AdminPage;
