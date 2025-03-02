import BoundingBox from "../components/BoundingBox";
import Faqcomp from "../components/Faqcomp";
import Navbar from "../components/Navbar";
const FAQs = () => {
  return (
    <div className="w-full h-full flex flex-col md:flex-row justify-center items-center p-4 md:p-12">
      <Navbar />
      <BoundingBox >
        <div className="faq w-full h-full overflow-y-auto">
          <h1
            className="text-[1.5rem] md:text-[3rem] text-prime"
            style={{ textShadow: "3px 3px 0px red" }}
          >
            FAQs
          </h1>
          <Faqcomp
            que={
              "What kinds of roles or positions are available within the club?"
            }
            ans={
              "Role of Core Committee member is available for Technical, Management and Design domain."
            }
          />
          <Faqcomp
            que={"Can I apply for multiple roles simultaneously?"}
            ans={"Yes, one can apply for multiple domains."}
          />
          <Faqcomp
            que={"Is there a deadline for submitting applications?"}
            ans={"The deadline will be informed in advanced based on the domain you choose to apply in."}
          />
          <Faqcomp
            que={"How can I edit or update my application after submission?"}
            ans={"Submissions cannot be edited once uploaded."}
          />
          <Faqcomp
            que={"What is the selection process?"}
            ans={
              "Recruitment task will be followed by an interview conducted by the Core Committee."
            }
          />
        </div>
      </BoundingBox>
    </div>
  );
};

export default FAQs;
