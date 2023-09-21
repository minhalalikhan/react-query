import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const DATA = [
    { id: 1, title: 'post 1' },
    { id: 2, title: 'post 2' },
    { id: 3, title: 'post 3' },
    { id: 4, title: 'post 4' }
]

function wait(sec) {
    return new Promise(resolve => setTimeout(resolve, sec))
}
function CommentList() {

    const Qclient = useQueryClient()
    const DataQuery = useQuery({
        queryKey: ['posts'],
        queryFn: () => wait(2000).then(() => [...DATA])
        // queryFn: () => Promise.reject('error message')
    })

    const DataMutation = useMutation({
        mutationFn: () => {
            return wait(1000).then(() => DATA.push({ id: 5, title: 'new post 5' }))
        },

        onSuccess: () => Qclient.invalidateQueries(['posts'])
    })



    if (DataQuery.isLoading)
        return (<div>Loading</div>)

    if (DataQuery.isError)
        return (<div>Error occured : {JSON.stringify(DataQuery.error)}</div>)

    return (
        <div>
            <button onClick={DataMutation.mutate}>add New Data</button>
            {DataMutation.isLoading && <h5>Updating..</h5>}
            {DataMutation.isSuccess && <h5>done..</h5>}

            {DataQuery.data.map((item, index) => {

                return <h3 key={index}>{item.title}</h3>
            })}
        </div>
    )
}

export default CommentList

