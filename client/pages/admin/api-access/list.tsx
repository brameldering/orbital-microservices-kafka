import React, { useState } from 'react';
import { Form, Table, Button, Row, Col } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { NextPageContext } from 'next';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components//ModalConfirmBox';
import { H1_API_ACCESS_ADMIN } from 'constants/form-titles';
import {
  IApiAccess,
  CURRENT_MICROSERVICES,
  MICROSERVICE_AUTH,
} from '@orbitelco/common';
import {
  API_ACCESS_LIST_PAGE,
  API_ACCESS_CREATE_PAGE,
  API_ACCESS_EDIT_PAGE,
} from 'constants/client-pages';
import { getRoles } from 'api/roles/get-roles';
import { getApiAccessList } from 'api/api-access/get-api-access-list';
import { useDeleteApiAccessMutation } from 'slices/apiAccessApiSlice';

interface TPageProps {
  roles: Array<{ role: string; roleDisplay: string }>;
  apiAccess: IApiAccess[];
  error?: string[];
}

const ApiAccessListscreen: React.FC<TPageProps> = ({
  roles,
  apiAccess,
  error,
}) => {
  // --------------- Delete Api Access ---------------
  const [deleteApiAccess, { isLoading: deleting, error: errorDeleting }] =
    useDeleteApiAccessMutation();

  const [confirmDeleteApiAccessModal, setConfirmDeleteApiAccessModal] =
    useState<boolean>(false);
  const [deleteApiAccessId, setDeleteApiAccessId] = useState<string>('');

  const confirmDeleteApiAccess = (id: string) => {
    setDeleteApiAccessId(id);
    setConfirmDeleteApiAccessModal(true);
  };
  const cancelDeleteApiAccess = () => setConfirmDeleteApiAccessModal(false);

  const deleteApiAccessHandler = async () => {
    try {
      await deleteApiAccess(deleteApiAccessId).unwrap();
      // perform a redirect to this page to refetch apiAccess records
      Router.push(API_ACCESS_LIST_PAGE);
    } catch (err) {
      // Do nothing because useDeleteApiAccessMutation will set errorDeleting in case of an error
    } finally {
      setConfirmDeleteApiAccessModal(false);
    }
  };
  // --------------------------------------------------
  const router = useRouter();
  let selectedMicroservice = router.query.selected as string | undefined;
  if (!selectedMicroservice) {
    selectedMicroservice = MICROSERVICE_AUTH;
  }
  const handleSelectChange = (event: any) => {
    const value = event.target.value;
    // Reload the page with the selected value as a query parameter
    Router.push(`${API_ACCESS_LIST_PAGE}/?selected=${value}`, undefined, {
      shallow: true,
    });
  };

  const microservices = CURRENT_MICROSERVICES.map((ms) => ({
    label: ms,
    value: ms,
  }));

  // --------------------------------------------------
  const isRoleAllowed = (role: string, allowedRoles: string[]) => {
    return allowedRoles.includes(role);
  };

  // --------------------------------------------------
  const loadingOrProcessing = deleting;

  return (
    <>
      <Meta title={H1_API_ACCESS_ADMIN} />
      <ModalConfirmBox
        showModal={confirmDeleteApiAccessModal}
        title='Delete Api Access'
        body='Are you sure you want to delete this Api Access?'
        handleClose={cancelDeleteApiAccess}
        handleConfirm={deleteApiAccessHandler.bind(this)}
      />
      <Row className='align-items-center my-0'>
        <Col>
          <h1>{H1_API_ACCESS_ADMIN}</h1>
        </Col>
        <Col className='text-end'>
          <Link href={API_ACCESS_CREATE_PAGE} style={{ marginRight: '10px' }}>
            <Button
              id={'BUTTON_create_apiAccess'}
              variant='primary'
              className='btn-sm'>
              <FaPlus /> Create Api Access
            </Button>
          </Link>
        </Col>
      </Row>
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
          <Form>
            <Form.Group
              as={Row}
              controlId='microservice'
              className='align-items-center'>
              <Col sm={2} className='d-flex align-items-center'>
                <Form.Label className='mb-0'>Microservice</Form.Label>
              </Col>
              <Col sm={10} className='d-flex align-items-center'>
                <Form.Select
                  aria-label='Select Microservice'
                  className='mt-0'
                  style={{
                    borderColor: '#606060',
                    maxWidth: '180px',
                    marginTop: '0',
                  }}
                  value={selectedMicroservice}
                  onChange={handleSelectChange}>
                  {microservices.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          </Form>
          {errorDeleting && <ErrorBlock error={errorDeleting} />}
          {apiAccess?.length === 0 ? (
            <p>There are no Api Access records</p>
          ) : (
            <Table striped hover responsive className='table-sm'>
              <thead>
                <tr>
                  {/* <th>MICROSERVICE</th> */}
                  <th>API NAME</th>
                  <th>ALLOWED ROLES</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apiAccess &&
                  apiAccess
                    // Filter the records based on selected microservice
                    .filter(
                      (apiAccess: any) =>
                        apiAccess.microservice === selectedMicroservice
                    )
                    .map((filteredApiAccess: any) => (
                      <tr key={filteredApiAccess.id}>
                        {/* <td id={`microservice_${filteredApiAccess.apiName}`}>
                      {filteredApiAccess.microservice}
                    </td> */}
                        <td
                          id={`apiName_${filteredApiAccess.apiName}`}
                          style={{
                            textAlign: 'left',
                          }}>
                          {filteredApiAccess.apiName}
                        </td>
                        <td id={`allowedRoles_${filteredApiAccess.apiName}`}>
                          <ul style={{ listStyle: 'none', padding: 0 }}>
                            {roles.map((roleObj) => {
                              const { role, roleDisplay } = roleObj;
                              const isAllowed = isRoleAllowed(
                                role,
                                filteredApiAccess.allowedRoles
                              );
                              return (
                                <li key={role}>
                                  {isAllowed ? (
                                    <span
                                      style={{
                                        display: 'block',
                                        textAlign: 'left',
                                      }}>
                                      <FaCheck style={{ color: 'green' }} />{' '}
                                      {roleDisplay}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        display: 'block',
                                        textAlign: 'left',
                                      }}>
                                      <FaTimes style={{ color: 'red' }} />{' '}
                                      {roleDisplay}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                        <td>
                          <Link
                            href={`${API_ACCESS_EDIT_PAGE}/${filteredApiAccess.id}`}
                            style={{ marginRight: '10px' }}>
                            <Button
                              id={`edit_${filteredApiAccess.apiName}`}
                              variant='light'
                              className='btn-sm'>
                              <FaEdit />
                            </Button>
                          </Link>
                          <Button
                            id={`delete_${filteredApiAccess.apiName}`}
                            variant='danger'
                            className='btn-sm'
                            onClick={() =>
                              confirmDeleteApiAccess(filteredApiAccess.id)
                            }>
                            <FaTrash style={{ color: 'white' }} />
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          )}
        </>
      )}
      {loadingOrProcessing && <Loader />}
    </>
  );
};

// Fetch ApiAccess
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
    const apiAccess = await getApiAccessList(context);
    return {
      props: { roles, apiAccess },
    };
  } catch (error) {
    const parsedError = parseError(error);
    return {
      props: { roles: [], apiAccess: [], error: parsedError },
    };
  }
};

export default ApiAccessListscreen;
