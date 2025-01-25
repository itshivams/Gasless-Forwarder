interface GaslessInfoProps {
  className?: string;
}

export const GaslessInfo = ({ className = "" }: GaslessInfoProps) => {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        About Gasless Transactions
      </h2>
      <div className="space-y-4 text-gray-600">
        <p>
          Gasless transactions allow you to send tokens without paying for gas
          fees. The gas fees are covered by a relayer service.
        </p>
        <div>
          <h3 className="mb-2 font-medium text-gray-900">How it works:</h3>
          <ul className="list-inside list-disc space-y-2">
            <li>Connect your wallet</li>
            <li>Enter transaction details</li>
            <li>Sign the message (no gas needed)</li>
            <li>Relayer executes the transaction</li>
          </ul>
        </div>
      </div>
    </div>
  );
};