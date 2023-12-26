import React, { useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { NextPageContext } from 'next';
import Router from 'next/router';
import Link from 'next/link';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components//ModalConfirmBox';
import { H1_ROLE_ADMIN } from 'constants/form-titles';
import { IRole } from '@orbitelco/common';
import {
  ROLE_LIST_PAGE,
  ROLE_CREATE_PAGE,
  ROLE_EDIT_PAGE,
} from 'constants/client-pages';
import { getRoles } from 'api/roles/get-roles';
import { useDeleteRoleMutation } from 'slices/rolesApiSlice';

interface TPageProps {
  roles: IRole[];
  error?: string[];
}

const RolesListScreen: React.FC<TPageProps> = ({ roles, error }) => {
  // --------------- Delete Role ---------------
  const [deleteRole, { isLoading: deleting, error: errorDeleting }] =
    useDeleteRoleMutation();

  const [confirmDeleteRoleModal, setConfirmDeleteRoleModal] =
    useState<boolean>(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string>('');

  const confirmDeleteRole = (id: string) => {
    setDeleteRoleId(id);
    setConfirmDeleteRoleModal(true);
  };
  const cancelDeleteRole = () => setConfirmDeleteRoleModal(false);

  const deleteRoleHandler = async () => {
    try {
      await deleteRole(deleteRoleId).unwrap();
      // perform a redirect to this page to refetch role records
      Router.push(ROLE_LIST_PAGE);
    } catch (err) {
      // Do nothing because useDeleteRoleMutation will set errorDeleting in case of an error
    } finally {
      setConfirmDeleteRoleModal(false);
    }
  };
  // --------------------------------------------------

  const loadingOrProcessing = deleting;

  return (
    <>
      <Meta title={H1_ROLE_ADMIN} />
      <ModalConfirmBox
        showModal={confirmDeleteRoleModal}
        title='Delete Role'
        body='Are you sure you want to delete this role?'
        handleClose={cancelDeleteRole}
        handleConfirm={deleteRoleHandler.bind(this)}
      />
      <Row className='align-items-center my-0'>
        <Col>
          <h1>{H1_ROLE_ADMIN}</h1>
        </Col>
        <Col className='text-end'>
          <Link href={ROLE_CREATE_PAGE} style={{ marginRight: '10px' }}>
            <Button
              id={'BUTTON_create_role'}
              variant='primary'
              className='btn-sm'>
              <FaPlus /> Create Role
            </Button>
          </Link>
        </Col>
      </Row>
      {errorDeleting && <ErrorBlock error={errorDeleting} />}
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
          {roles?.length === 0 ? (
            <p>There are no roles</p>
          ) : (
            <Table striped hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ROLE</th>
                  <th>ROLE DISPLAY</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {roles &&
                  roles.map((role: any) => (
                    <tr key={role.id}>
                      <td id={`role_${role.role}`}>{role.role}</td>
                      <td id={`roleDisplay_${role.role}`}>
                        {role.roleDisplay}
                      </td>
                      <td>
                        <Link
                          href={`${ROLE_EDIT_PAGE}/${role.id}`}
                          style={{ marginRight: '10px' }}>
                          <Button
                            id={`edit_${role.role}`}
                            variant='light'
                            className='btn-sm'>
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          id={`delete_${role.role}`}
                          variant='danger'
                          className='btn-sm'
                          onClick={() => confirmDeleteRole(role.id)}>
                          <FaTrash style={{ color: 'white' }} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}{' '}
        </>
      )}
      {loadingOrProcessing && <Loader />}
    </>
  );
};

// Fetch Roles
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
    return {
      props: { roles },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { roles: [], error: parsedError },
    };
  }
};

export default RolesListScreen;
