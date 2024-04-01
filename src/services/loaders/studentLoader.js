import { getStudent } from "@services/apiServices";

export async function studentLoader({ params }) {
    return getStudent(params.studentId)
}