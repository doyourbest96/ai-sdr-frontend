import UploadedFiles from "./UploadedFiles";
import { SuccessModel, TrainingDocument } from "@/types";
import { useEffect, useState } from "react";
import Upload from "../upload";
import { handleError, runService } from "@/utils/service_utils";
import { getCaseStudies } from "@/services/trainingDocumentService";
import { deleteTrainingDocument } from "@/services/trainingDataService";
import { toast } from "react-toastify";

const CaseStudy = () => {
  const [caseStudies, setCaseStudies] = useState<TrainingDocument[]>();

  const fetchCaseStudies = () => {
    runService(
      {},
      getCaseStudies,
      (data) => {
        setCaseStudies(data);
      },
      (statusCode, error) => {
        handleError(statusCode, error);
      }
    );
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const handleDeleteFile = (id: string) => {
    runService(
      { id },
      deleteTrainingDocument,
      (data) => {
        if (data.success) {
          setCaseStudies(caseStudies?.filter((file) => file.id !== id));
          toast.success("Successfully deleted");
        } else {
          toast.success("Something goes wrong!");
        }
      },
      (status, error) => {
        console.log(status, error);
      }
    );
  };

  return (
    <>
      <label
        htmlFor="testimonials"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Case Study
      </label>
      <div className="ml-8">
        <Upload
          type="case-study"
          description="Drop or select case study files to upload for training"
          onUpload={(data: SuccessModel) => {
            if (data.success) {
              fetchCaseStudies();
              toast.success("Successfully uploaded");
            } else {
              toast.error("Something goes wrong, please contact us!");
            }
          }}
        />
      </div>
      <div className="h-8" />
      {caseStudies && caseStudies.length > 0 && (
        <UploadedFiles
          title="Uploaded case studies"
          files={caseStudies}
          onDelete={(id: string) => handleDeleteFile(id)}
        />
      )}
    </>
  );
};

export default CaseStudy;
