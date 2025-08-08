// import { useEffect, useState } from "react";
// import { IComment } from "@/types/comment.type";
// import commentApi from "@/services/comment.service";


// type Props = {
//   parentCommentId: string;
// };

// export default function ChildComments({ parentCommentId }: Props) {
//   const [comments, setComments] = useState<IComment[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchChildComments = async () => {
//       setLoading(true);
//       try {
//         const res = await commentApi.getChildComments(parentCommentId);
//         setComments(res.data);
//       } catch (error) {
//         console.error("Failed to fetch child comments", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChildComments();
//   }, [parentCommentId]);

//   if (loading) return <p>Đang tải phản hồi...</p>;
//   if (!comments.length) return null;

//   return (
//     <div className="ml-10 mt-2 space-y-3">
//     {comments.map((comment) => (
//       <div key={comment._id} className="flex items-start gap-2">
//         <img
//           src={comment.author.avatar || "/assets/img/user.png"}
//           className="w-8 h-8 rounded-full object-cover"
//           alt="avatar"
//         />
//         <div className="bg-gray-100 rounded-lg px-3 py-2">
//           <p className="font-semibold text-sm">{comment.author.name}</p>
//           <p className="text-sm">{comment.text}</p>
//         </div>
//       </div>
//     ))}

//     {/* Input phản hồi */}
//       <div className="flex items-start gap-2 mt-4">
//         <img
//           src="/assets/img/user.png" 
//           className="w-8 h-8 rounded-full object-cover"
//           alt="avatar"
//         />
//         <div className="flex-1">
//           <textarea
//             className="w-full p-2 border rounded-lg text-sm"
//             rows={2}
//             placeholder="Viết phản hồi..."
      
//           />
//           <button
//             className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//           >
//             Gửi
//           </button>
//         </div>
//       </div>

//   </div>
//   );
// }
