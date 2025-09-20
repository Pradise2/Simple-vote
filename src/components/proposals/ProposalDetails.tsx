import { useReadContract } from 'wagmi';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../../constants';
const ProposalDetails = ({ proposalId }: { proposalId: bigint }) => {
const { data: proposal, isLoading } = useReadContract({
abi: VOTING_CONTRACT_ABI,
address: VOTING_CONTRACT_ADDRESS,
functionName: 'getProposal',
args: [proposalId],
});
if (isLoading || !proposal) return <div>Loading details...</div>;
const [id, title, description, startTime, endTime, totalVotes, optionDescriptions] = proposal;
const formatTimestamp = (timestamp: bigint) => new Date(Number(timestamp) * 1000).toLocaleString();
return (
<div className="bg-gray-800 p-6 rounded-lg">
<h1 className="text-3xl font-bold mb-4">{title}</h1>
<p className="text-gray-300 mb-6">{description}</p>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
<div className="bg-gray-700 p-3 rounded">
<p className="text-sm text-gray-400">Starts</p>
<p className="font-semibold">{formatTimestamp(startTime)}</p>
</div>
<div className="bg-gray-700 p-3 rounded">
<p className="text-sm text-gray-400">Ends</p>
<p className="font-semibold">{formatTimestamp(endTime)}</p>
</div>
<div className="bg-gray-700 p-3 rounded">
<p className="text-sm text-gray-400">Total Votes</p>
<p className="font-semibold">{totalVotes.toString()}</p>
</div>
</div>
</div>
);
};
export default ProposalDetails;
