import React from "react";

type SearchPreviewProps = {
  title: string;
  description: string;
  slug: string;
  thumbnail?: string;
  domain?: string;
};

const SearchPreview: React.FC<SearchPreviewProps> = ({
  title,
  description,
  slug,
  thumbnail,
  domain = "www.example.com",
}) => {
  const url = `${domain}/${slug}`;
  const truncate = (text: string, max: number) =>
  text.length > max ? text.slice(0, max - 3) + "..." : text;
  const displayTitle = truncate(title, 70);
  const displayDescription = truncate(description, 170);

  return (
    <div className="flex flex-col items-center my-4 mx-2 gap-6">
        <h2>Browser Preview</h2>
      <div className="max-w-xl min-w-md border rounded-lg p-4 bg-white shadow">
        <div className="text-sm text-gray-600">{url}</div>
        <div className="text-blue-700 text-lg font-semibold hover:underline cursor-pointer">
          {displayTitle}
        </div>
        <div className="text-gray-700 text-sm mt-1 line-clamp-2">
          {displayDescription}
        </div>
      </div>
      <div className="max-w-xl min-w-md border rounded-lg p-4 bg-white shadow">
        <div className="text-sm text-gray-600">{url}</div>
        <div className="text-blue-700 text-lg font-semibold hover:underline cursor-pointer">
          {title}
        </div>
        <div className="flex gap-3 mt-1">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={title}
              className="rounded-md border w-28 h-20 object-cover"
            />
          )}
          <div className="text-gray-700 text-sm line-clamp-3">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPreview;
