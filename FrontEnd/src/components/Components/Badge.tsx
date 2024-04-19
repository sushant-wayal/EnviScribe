interface BadgeProps {
  content: string;
  className?: string;
}

const Badge : React.FC<BadgeProps> = ({ content, className }) => {
  return (
    <div className={`bg-[#222222] flex justify-center items-center rounded-full px-2 py-1 ${className}`}>
      <pre>{content}</pre>
    </div>
  )
}

export default Badge;