import { graphql } from "@/generated/gql";

export const RECORD_ATTENDANCE = graphql(`
  mutation RecordAttendance($input: RecordAttendanceInput!) {
    recordAttendance(input: $input)
  }
`);

export const EXPORT_ATTENDANCE = graphql(`
  mutation ExportAttendance($input: ExportAttendanceInput!) {
    exportAttendance(input: $input) {
      jobId
    }
  }
`);
