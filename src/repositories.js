import React from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import { List, Datagrid, TextField, Filter, SelectInput } from 'react-admin';
import Button from '@material-ui/core/Button';

const MAINTAINED = 'maintained';
const TRANSMITTED = 'transmitted';
const HACKDAY = 'hackday';
const PUBLICATION = 'publication';
const ONBOARDING = 'onboarding';
const ARCHIVED = 'archived';

const decisions = [
    { id: MAINTAINED, name: 'maintained' },
    { id: TRANSMITTED, name: 'transmitted' },
    { id: HACKDAY, name: 'hackday' },
    { id: PUBLICATION, name: 'publication' },
    { id: ONBOARDING, name: 'onboarding' },
    { id: ARCHIVED, name: 'archived' },
];

const RepositoryFilters = (props) => (
    <Filter {...props}>
        <SelectInput
            source="decision"
            label="Status"
            choices={decisions}
            style={{ minWidth: 250 }}
            alwaysOn
        />
    </Filter>
);

const Links = ({ record }) => {
    if (!record) return null;
    return (
        <>
            <Button variant="outlined" size="small" color="primary" href={`https://github.com/marmelab/${record.name}`} target="_blank">
                Github
            </Button>
            {record.homepage && record.homepage !== 'none' && (
                <Button variant="outlined" size="small" href={record.homepage} target="_blank">
                    HomePage
                </Button>

            )}
        </>
    );
};

const RepoList = (props) => {
    return (
        <List
            {...props}
            exporter={false}
            bulkActionButtons={false}
            filters={<RepositoryFilters />}
            filterDefaultValues={{}}
            sort={{ field: 'starsNumber', order: 'DESC' }}
        >
            <Datagrid>
                <TextField source="name" sortable={true} />
                <Links label="Link.s" />
                <TextField source="starsNumber" label="Stars"  sortable={true} />
                <TextField source="decision" label="Status" sortable={true} />
                <TextField source="description" sortable={false} />
            </Datagrid>
        </List>
    );
};


const repositories = {
    name: 'repositories',
    icon: GitHubIcon,
    list: RepoList,
};

export default repositories;