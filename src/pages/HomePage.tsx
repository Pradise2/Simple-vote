import { useReadContract } from 'wagmi';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../constants';
import ProposalCard from '../components/proposals/ProposalCard';

const HomePage = () => {
  // Fetch the total number of proposals from the smart contract
  const { data: proposalCount, isLoading, error } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'getProposalCount',
  });

  if (isLoading) return <div className="text-center">Loading proposals...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching proposals: {error.message}</div>;

  const totalProposals = proposalCount ? Number(proposalCount) : 0;
  
  // Create an array of proposal IDs to fetch them
  const proposalIds = Array.from({ length: totalProposals }, (_, i) => BigInt(i + 1));

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">All Proposals</h1>
      {totalProposals === 0 ? (
        <p className="text-center text-gray-400">No proposals have been created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposalIds.map((id) => (
            <ProposalCard key={id.toString()} proposalId={id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
