import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

type FormValues = {
  _id: string;
  name: string;
  type: string;
  location: string;
  pay: string;
  requiredSkills: string[];
  description: string;
};

const skillOptions = ["Coding", "Cooking", "Fitness"];

const JobEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state?.jobData as FormValues; // Receive the jobData from the previous page
  

  const [requiredSkills, setRequiredSkills] = useState<string[]>(jobData?.requiredSkills || []);
  const [type, setJobType] = useState(jobData?.type || "full-time");

  const { register, handleSubmit, formState, setValue } = useForm<FormValues>({
    defaultValues: {
      name: jobData?.name || "",
      type: jobData?.type || "",
      location: jobData?.location || "",
      pay: jobData?.pay || "",
      description: jobData?.description || "",
      requiredSkills: jobData?.requiredSkills || []
    },
  });
  
  const { errors } = formState;

  // Set each form field with jobData values on load
  useEffect(() => {
    if (jobData) {
      setValue("name", jobData.name);
      setValue("type", jobData.type);
      setValue("location", jobData.location);
      setValue("pay", jobData.pay);
      setValue("description", jobData.description);
      setRequiredSkills(jobData.requiredSkills);
    }
  }, [jobData, setValue]);
  
  const handleSkillsChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setRequiredSkills(Array.isArray(value) ? value : [value]);
  };

  const onSubmit = (data: FormValues) => {
    const url = "http://localhost:8000/api/v1/users/editJob";
    const body = {
        id: jobData._id,
        name: data.name,
        type: data.type,
        location: data.location,
        pay: data.pay,
        description: data.description,
        requiredSkills: data.requiredSkills,
    };
    console.log(body);
    axios.post(url, body).then((res) => {
      if (res.status !== 200) {
        toast.error("Failed to update job");
        return;
      }else{
        navigate("/dashboard");
        toast.success("Update success!");
      }
    });
  };
 
  return (
    <>
      <div className="flex flex-row">
        <div className="w-3/12 pt-10 border-r" style={{ height: "calc(100vh - 72px)" }}>
          <div className="flex flex-col items-start ml-10 mt-10 ">
            {/* Other steps... */}
          </div>
        </div>
        <div className="w-9/12 pt-10 pl-10" style={{ height: "calc(100vh - 72px)" }}>
          <div className="text-2xl translate-x-10">Edit Job</div>
          <div className="flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="m-4 mx-10">
              <Stack spacing={2} width={600}>
                <TextField
                  label="Job Role"
                  type="text"
                  {...register("name", { required: "Job role is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <FormControl>
                  <InputLabel id="role-id">Job Type</InputLabel>
                  <Select
                    value={type}
                    labelId="role-id"
                    label="Job Type"
                    id="role"
                    onChange={(e: SelectChangeEvent) => setJobType(e.target.value)}
                  >
                    <MenuItem value={"full-time"}>Full Time</MenuItem>
                    <MenuItem value={"part-time"}>Part Time</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Location"
                  type="text"
                  {...register("location")}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
                <TextField
                  label="Pay(per hour)"
                  type="number"
                  {...register("pay", { required: "Job pay is required" })}
                  error={!!errors.pay}
                  helperText={errors.pay?.message}
                />
                <TextField
                  label="Job Description"
                  type="text"
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  minRows={4}
                  multiline
                />
                <FormControl>
                  <InputLabel id="skills-label">Required Skills</InputLabel>
                  <Select
                    labelId="Required Skills"
                    id="Required Skills"
                    multiple
                    value={requiredSkills}
                    onChange={handleSkillsChange}
                  >
                    {skillOptions.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  variant="outlined"
                  style={{
                    color: "#FF5353",
                    borderColor: "#FF5353",
                    textTransform: "none",
                    fontSize: "16px",
                    minWidth: "200px",
                  }}
                >
                  Update
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobEdit;
