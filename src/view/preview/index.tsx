import React from "react";
import useStore from "@/store";
import Header from "@/components/Header";
import Content from "@/components/Content";
import ReactMackdown from "@/components/ReactMackdown";

const CreateMackdown: React.FC = () => {
  const { create } = useStore();
  return (
    <div>
      <Header>Preview mackdown</Header>
      <Content>
        <ReactMackdown mackdown={create.mackdown} />
      </Content>
    </div>
  );
};

export default CreateMackdown;
