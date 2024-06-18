import React from "react";

export default function CourseId({ params }: { params: { courseId: string } }) {
  return <div>Course: {params.courseId}</div>;
}
