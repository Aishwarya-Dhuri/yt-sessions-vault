export const GlobalConstants = {
    LOGIN_LOCAL_KEY :"loggedInUserId"
}

export const APIMethods = {
    LOGIN:{
        AUTHENTICATE : 'BatchUser/login'
    },
    BATCHES:{
        NEW_BATCH : 'Batches',
        UPDATE_BATCH : 'Batches/',
    },
    CANDIDATES:{
        GET_CANDIDATES: 'Candidates',
        CREATE_CANDIDATE:'Candidates/'
    },
     BATCH_ENROLLMENTS:{
        GET_ALL_ENROLLMENTS : 'BatchEnrollments/GetAllEnrollment',
        CREATE_BATCH_ENROLLMENTS:'BatchEnrollments/',
        GET_ENROLLED_BATCHES_BY_CANDIDATE_ID: 'BatchEnrollments/by-candidate/',
    },
    BATCH_SESSIONS:{
        GET_ALL_SESSION_RECORDINGDS :'BatchSessions/GetAllSessionsRecordings',
        CREATE_BATCH_SESSION:'BatchSessions/'
    }
  
    
}