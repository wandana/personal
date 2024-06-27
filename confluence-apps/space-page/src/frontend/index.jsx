import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke } from '@forge/bridge';
import api, { route } from "@forge/api";
import { requestConfluence, router } from '@forge/bridge';
import {
  Modal,
  ModalBody,
  ModalTransition,
  ModalTitle,
  ModalFooter,
  ModalHeader,
  Form,
  useForm,
  useProductContext,
  Textfield,
  Label,
  Button,
  Text,
  Strong,
  Select,
  RadioGroup,
  TextArea,
  Tabs,
  TabList,
  TabPanel,
  Tab,
  Box,
  Link
} from "@forge/react";


const App = () => {
  //const [data, setData] = useState(null);
  const context = useProductContext();
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const openFirstModal = () => setIsFirstModalOpen(true);
  const closeFirstModal = () => setIsFirstModalOpen(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const openSecondModal = () => setIsSecondModalOpen(true);
  const closeSecondModal = () => setIsSecondModalOpen(false);

  //Don't add Button here!
  const { register, getFieldId, handleSubmit } = useForm();


  const handleNext = (data) => {
    console.log(data);
    closeFirstModal();
    openSecondModal();
  }
  const handleCreatePrd = async () => {
    console.log(context.extension.space.id);
    var space_id = context.extension.space.id;
    var bodyData = `{
      "spaceId": "${space_id}",
      "title": "PRD ${new Date().toISOString().slice(0, 20)}",
      "status": "current",
      "body": {
        "storage": {
          "value": "\u003Ch3\u003EProduct Context\u003C/h3\u003E\u003Cp /\u003E\u003Ch3\u003EFeature Context\u003C/h3\u003E\u003Cp /\u003E\u003Ch3\u003EHigh level requirements\u003C/h3\u003E\u003Cp /\u003E\u003Ch3\u003EDetailed requirements\u003C/h3\u003E",
          "representation": "storage"
        }
      }
    }`;
    console.log(bodyData);

    try {

      const response = await requestConfluence(`/wiki/api/v2/pages`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: bodyData
      });
      const responseJson = await response.json();
      const pageId = responseJson.id;
      const spaceId = responseJson.spaceId;
      //router.navigate();
      router.navigate(`/wiki/spaces/${spaceId}/pages/${pageId}/page`)
    } catch (error) {
      console.log(error);
    }

    closeSecondModal();
  };

  const prdTypeOptions = [
    { name: 'prdType', value: 'userfacing', label: 'User-facing product' },
    { name: 'prdType', value: 'api', label: 'API' },
    { name: 'prdType', value: 'other', label: 'Other' },
  ];

  const prdGoalOptions = [
    { name: 'prdGoal', value: 'leadership', label: 'Leadership buy-in' },
    { name: 'prdGoal', value: 'roadmap', label: 'Roadmap planning' },
    { name: 'prdGoal', value: 'impl', label: 'Implementation' },
  ];

  useEffect(() => {
    //invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <>
      <Text>Welcome to your Wisary powered space</Text>
      <Text>  </Text>
      <Text>  </Text>
      <Button onClick={openFirstModal}>Create First Document</Button>
      <ModalTransition>
        {isFirstModalOpen && (
          <Modal onClose={closeFirstModal}>
            <Form onSubmit={handleSubmit(handleNext)}>

              <ModalHeader>
                <ModalTitle>Document Context</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Label labelFor={getFieldId("docType")}>Document Type</Label>
                <Select {...register("docType", { required: false })}
                  isDisabled
                  placeholder='Product Requirements'
                />

                <Label labelFor={getFieldId("prdType")}>Product Type</Label>
                <RadioGroup
                  options={prdTypeOptions}
                  {...register("prdType", { required: true })}
                />

                <Label labelFor={getFieldId("prdGoal")}>Goal and Audience</Label>
                <RadioGroup
                  options={prdGoalOptions}
                  {...register("prdGoal", { required: true })}
                />
              </ModalBody>
              <ModalFooter>
                <Button appearance="subtle" onClick={closeFirstModal}>
                  Cancel
                </Button>
                <Button appearance="primary" type="submit">
                  Next
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        )}
      </ModalTransition>
      <ModalTransition>
        {isSecondModalOpen && (
          <Modal onClose={closeSecondModal}>
            <Form onSubmit={handleSubmit(handleCreatePrd)}>

              <ModalHeader>
                <ModalTitle>Project Context</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Label labelFor={getFieldId("docContext")}>Document Context</Label>
                <TextArea placeholder='Enter the product context...' {...register("docContext", { required: true })} />

                <Label labelFor={getFieldId("featureContext")}>Feature Context</Label>
                <TextArea placeholder='Enter the feature context...' {...register("featureContext")} />
              </ModalBody>
              <ModalFooter>
                <Button appearance="subtle" onClick={closeSecondModal}>
                  Cancel
                </Button>
                <Button appearance="primary" type="submit">
                  Create PRD
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        )}
      </ModalTransition>
      <Text>{'\n\n\n\n\n\n\n\n'}</Text>
      <Tabs id="default">
        <TabList>
          <Tab>Project</Tab>
        </TabList>
        <TabPanel>
          <Box padding="space.300">
            <Text><Link href=''>Project requirements</Link></Text>
            <Text><Link href=''>Task Breakdown</Link></Text>
          </Box>
        </TabPanel>
      </Tabs>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
