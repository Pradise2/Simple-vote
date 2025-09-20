import { Link } from 'react-router-dom';
import { useModal } from '@reown/react';
import { useAccount, useDisconnect, useReadContract } from 'wagmi';
import { VOTING_CONTRACT_ABI, VOTING_CONTRACT_ADDRESS } from '../../constants';

const Header = () => {
  const { open } = useModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Fetch contract owner to display the Admin link conditionally
  const { data: ownerAddress } = useReadContract({
    abi: VOTING_CONTRACT_ABI,
    address: VOTING_CONTRACT_ADDRESS,
    functionName: 'owner',
  });

  const isOwner = address && ownerAddress && address === ownerAddress;

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300">
          VoteDApp
        </Link>
        <div className="flex items-center space-x-4">
          {isOwner && (
             <Link to="/admin" className="text-yellow-400 font-semibold hover:text-yellow-300">
                Admin Panel
            </Link>
          )}
          {isConnected ? (
            <div className="flex items-center space-x-3">
              <span className="bg-gray-700 px-3 py-1 rounded-md text-sm">
                {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </span>
              <button onClick={() => disconnect()} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={() => open()} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold">
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
