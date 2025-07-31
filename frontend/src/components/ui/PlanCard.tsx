import Button from "@/components/ui/Button";

interface PlanCardProps {
  title: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
}

export const PlanCard = ({
  title,
  price,
  features,
  isFeatured = false,
}: PlanCardProps) => {
  const featuredStyles = isFeatured
    ? "bg-yellow-100 text-purple-800"
    : "bg-white text-gray-800";

  const featuredButtonStyles = isFeatured
    ? "bg-purple-700 hover:bg-purple-800 shadow-[inset_-4px_-4px_0px_0px_#4a148c]"
    : "";

  return (
    <div
      className={`p-6 pixel-border text-center w-[501px] h-[260px] ${featuredStyles}`}
    >
      <h4 className="text-lg">{title}</h4>
      <p
        className={`text-xl my-4 font-bold ${
          isFeatured ? "text-purple-700" : "text-blue-700"
        }`}
      >
        {price}
      </p>
      <ul className="text-left space-y-2 text-xs">
        {features.map((feature, index) => (
          <li key={index}> {feature}</li>
        ))}
      </ul>
      <Button
        variant="primary"
        className={`mt-6 text-sm ${featuredButtonStyles}`}
      >
        Assinar
      </Button>
    </div>
  );
};
