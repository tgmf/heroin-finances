const functions = require('firebase-functions')
const admin = require('firebase-admin')
const FieldValue = require('firebase-admin').firestore.FieldValue

admin.initializeApp()

const firestoredb = admin.firestore()

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message)
    this.message = message
    this.type = 'UnauthenticatedError'
  }
}

class NotAnAdminError extends Error {
  constructor(message) {
    super(message)
    this.message = message
    this.type = 'NotAnAdminError'
  }
}

exports.createUser = functions.https.onCall(async (data, context) => {

  try {

    //Checking that the user calling the Cloud Function is authenticated
    if (!context.auth) {
      throw new UnauthenticatedError('Вы не авторизованы. Только авторизованный администратор может добавлять пользователей.')
    }

    //Checking that the user calling the Cloud Function is an Admin user
    const callerUid = context.auth.uid  //uid of the user calling the Cloud Function
    const callerUserRecord = await admin.auth().getUser(callerUid)
    if (!callerUserRecord.customClaims.admin) {
      throw new NotAnAdminError('Добавлять пользователей может только администратор.')
    }

    const userCreationRequest = {
      userDetails: data,
      status: 'Pending',
      createdBy: callerUid,
      createdOn: FieldValue.serverTimestamp()
    }

    const userCreationRequestRef = await firestoredb.collection("userCreationRequests").add(userCreationRequest)

    const newUser = {
      email: data.email,
      emailVerified: false,
      password: data.password,
      displayName: data.displayName,
      disabled: false
    }

    const userRecord = await admin
      .auth()
      .createUser(newUser)

    const userId = userRecord.uid

    const claims = {}
    claims["manager"] = true
    claims["admin"] = data.isAdmin
    claims['heroinmarketing'] = true

    await admin.auth().setCustomUserClaims(userId, claims)

    await firestoredb.collection("users").doc(userId).set(data)

    await userCreationRequestRef.update({ status: 'Treated' })

    return { result: 'Новый пользователь создан.' }


  } catch (error) {

    if (error.type === 'UnauthenticatedError') {
      throw new functions.https.HttpsError('unauthenticated', error.message)
    } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
      throw new functions.https.HttpsError('failed-precondition', error.message)
    } else {
      throw new functions.https.HttpsError('internal', error)
    }

  }

})

exports.updateUser = functions.https.onCall(async (data, context) => {

  try {

    if (!context.auth) {
      throw new UnauthenticatedError('Вы не авторизованы. Только авторизованный администратор может изменять информацию пользователей.')
    }

    const callerUid = context.auth.uid
    const callerUserRecord = await admin.auth().getUser(callerUid)
    if (!callerUserRecord.customClaims.admin) {
      throw new NotAnAdminError('Изменять информацию пользователей может только администратор.')
    }

    const newClaims = {
      admin: data.isAdmin
    }


    const uid = data.id
    await admin.auth().setCustomUserClaims(uid, newClaims)

    await firestoredb.collection("users").doc(uid).update({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      isAdmin: data.isAdmin
    }).then(function () {
      return { result: 'База данных обновлена.' }
    })
      .catch(function (error) {
        console.log('Ошибка при обновлении базы данных:', error)
      })

    await admin.auth().updateUser(uid, {
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    }).then(function () {
      return { result: 'Пользователь изменен.' }
    })
      .catch(function (error) {
        console.log('Ошибка при изменении пользователя:', error)
      })

  } catch (error) {
    if (error.type === 'UnauthenticatedError') {
      throw new functions.https.HttpsError('unauthenticated', error.message)
    } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
      throw new functions.https.HttpsError('failed-precondition', error.message)
    } else {
      throw new functions.https.HttpsError('internal', error)
    }
  }

})

exports.deleteUser = functions.https.onCall(async (data, context) => {

  try {
    if (!context.auth) {
      throw new UnauthenticatedError('Вы не авторизованы. Только авторизованный администратор может удалять пользователей.')
    }

    const callerUid = context.auth.uid
    const callerUserRecord = await admin.auth().getUser(callerUid)
    if (!callerUserRecord.customClaims.admin) {
      throw new NotAnAdminError('Удалять пользователей может только администратор.')
    }

    const uid = data.id

    await firestoredb.collection("users").doc(uid).delete().then(function () {
      return { result: 'База данных обновлена.' }
    })
      .catch(function (error) {
        console.log('Ошибка при обновлении базы данных:', error)
      })

    admin.auth().deleteUser(uid)
      .then(function () {
        return { result: 'Пользователь удален.' }
      })
      .catch(function (error) {
        console.log('Ошибка при удалении пользователя:', error)
      })

  } catch (error) {
    if (error.type === 'UnauthenticatedError') {
      throw new functions.https.HttpsError('unauthenticated', error.message)
    } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
      throw new functions.https.HttpsError('failed-precondition', error.message)
    } else {
      throw new functions.https.HttpsError('internal', error)
    }
  }
})

exports.createProject = functions.https.onCall(async (data, context) => {

  try {
    var batch = firestoredb.batch()

    //Checking that the user calling the Cloud Function is authenticated
    if (!context.auth) {
      throw new UnauthenticatedError('Вы не авторизованы. Только авторизованный администратор может создавать проекты.')
    }

    //Checking that the user calling the Cloud Function is an Admin user
    const callerUid = context.auth.uid  //uid of the user calling the Cloud Function
    const callerUserRecord = await admin.auth().getUser(callerUid)
    if (!callerUserRecord.customClaims.admin) {
      throw new NotAnAdminError('Создавать проекты может только администратор.')
    }

    const projectCreationRequest = {
      projectDetails: data,
      status: 'Pending',
      createdBy: callerUid,
      createdOn: FieldValue.serverTimestamp()
    }

    const projectCreationRequestRef = await firestoredb.collection("projectCreationRequests").add(projectCreationRequest)

    const newProject = {
      name: data.name,
      slug: data.slug,
      business: data.business,
      type: data.type,
      client: data.client,
      new: data.new,
      director: data.director,
      directorsCut: data.directorsCut,
      account: data.account,
      manager: data.manager,
      sum: data.sum,
      tax: data.tax,
      dateOfCreation: data.dateOfCreation,
      dates: data.dates,
      payments: data.payments,
      expenses: [],
      heroin: data.heroin,
      common: data.common,
      reserve: data.reserve,
      profit: data.profit,
      disabled: false
    }

    batch.set(firestoredb.collection("projects").doc(newProject.slug), newProject)

    if (data.expenses.length > 0) {
      let indexRef = firestoredb.collection("transactions").doc("index")
      let idN = await indexRef.get().then((doc) => {
        return doc.data().current
      })
      data.expenses.forEach((transaction) => {
        transaction.idN = idN
        idN++
        let docRef = firestoredb.collection("transactions").doc()
        batch.set(docRef, transaction)
        batch.set(indexRef, { current: idN })
      })
    }

    batch.commit()

    await projectCreationRequestRef.update({ status: 'Treated' })

    return { result: 'Проект создан.' }

  } catch (error) {

    if (error.type === 'UnauthenticatedError') {
      throw new functions.https.HttpsError('unauthenticated', error.message)
    } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
      throw new functions.https.HttpsError('failed-precondition', error.message)
    } else {
      throw new functions.https.HttpsError('internal', error)
    }
  }
})

exports.updateProject = functions.https.onCall(async (data, context) => {

  try {
    if (!context.auth) {
      throw new UnauthenticatedError('Вы не авторизованы. Только авторизованный администратор может редактировать проекты.')
    }

    var batch = firestoredb.batch()

    batch.update(firestoredb.collection("projects").doc(data.slug), {
      name: data.name,
      business: data.business,
      type: data.type,
      client: data.client,
      new: data.new,
      director: data.director,
      directorsCut: data.directorsCut,
      account: data.account,
      manager: data.manager,
      sum: data.sum,
      tax: data.tax,
      dateOfCreation: data.dateOfCreation,
      dates: data.dates,
      payments: data.payments,
      expenses: [],
      heroin: data.heroin,
      common: data.common,
      reserve: data.reserve,
      profit: data.profit,
    })

    let expensesToUpdate = data.expenses.filter(expense => expense.status !== false)
    if (expensesToUpdate.length > 0) {
      let indexRef = firestoredb.collection("transactions").doc("index")
      let idN = await indexRef.get().then((doc) => {
        return doc.data().current
      })
      let doIncrement = false
      expensesToUpdate.forEach((transaction) => {
        var docRef = null
        if (transaction.status === "removing") {
          if (transaction.id !== null) {
            docRef = firestoredb.collection("transactions").doc(transaction.id)
            batch.delete(docRef)
          }
        } else if (transaction.status === "editing") {
          docRef = firestoredb.collection("transactions").doc(transaction.id)
          batch.set(docRef, transaction)
        } else if (transaction.status === "new") {
          transaction.idN = idN
          doIncrement = true
          idN++
          docRef = firestoredb.collection("transactions").doc()
          batch.set(docRef, transaction)
        }
      })
      if (doIncrement) batch.set(indexRef, { current: idN })
    }

    batch.commit()

  } catch (error) {
    if (error.type === 'UnauthenticatedError') {
      throw new functions.https.HttpsError('unauthenticated', error.message)
    } else if (error.type === 'InvalidRoleError') {
      throw new functions.https.HttpsError('failed-precondition', error.message)
    } else {
      throw new functions.https.HttpsError('internal', error)
    }
  }
})

exports.deleteProject = functions.https.onCall(async (data, context) => {

  try {
    if (!context.auth) {
      throw new UnauthenticatedError('Вы не авторизованы. Только авторизованный администратор может удалять проекты.')
    }

    const callerUid = context.auth.uid
    const callerUserRecord = await admin.auth().getUser(callerUid)
    if (!callerUserRecord.customClaims.admin) {
      throw new NotAnAdminError('Удалять проекты может только администратор.')
    }

    var batch = firestoredb.batch()

    batch.delete(firestoredb.collection("projects").doc(data.slug))

    const transactionsRef = firestoredb.collection("transactions")
    const forDelete = await transactionsRef.where('slug', '==', data.slug).get()
    forDelete.forEach(transaction => {
      batch.delete(transaction.ref)
    })

    batch.commit()

    return { result: 'Проект удален.' }
  } catch (error) {
    if (error.type === 'UnauthenticatedError') {
      throw new functions.https.HttpsError('unauthenticated', error.message)
    } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
      throw new functions.https.HttpsError('failed-precondition', error.message)
    } else {
      throw new functions.https.HttpsError('internal', error)
    }
  }
})

exports.updateTransaction = functions.https.onCall(async (data, context) => {

  try {
    if (!context.auth) {
      throw new UnauthenticatedError('Вы не авторизованы. Только авторизованный администратор может редактировать проекты.')
    }

    const docRef = firestoredb.collection("transactions")
    if (data.status === "removing") {
      await docRef.doc(data.id).delete()
    } else if (data.status === "editing") {
      docRef.doc(data.id).set(data)
    } else if (data.status === "new") {
      let indexRef = docRef.doc("index")
      let idN = await indexRef.get().then((doc) => {
        return doc.data().current
      })
      let batch = firestoredb.batch()
      data.idN = idN
      idN++
      batch.set(docRef.doc(), data)
      batch.set(indexRef, { current: idN })
      batch.commit()
    }
  } catch (error) {
    if (error.type === 'UnauthenticatedError') {
      throw new functions.https.HttpsError('unauthenticated', error.message)
    } else if (error.type === 'InvalidRoleError') {
      throw new functions.https.HttpsError('failed-precondition', error.message)
    } else {
      throw new functions.https.HttpsError('internal', error)
    }
  }
})
