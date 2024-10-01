import React, { useState, useCallback, lazy, Suspense } from 'react';
import BaseView from '@container/base';
import { useLang } from '@context/langContext';
import Loader from '@components/loader';
import { strings } from '@translations/locale';
import Button from '@components/button';
import { navigate } from '@navigation/ref';
import { useFocusEffect } from '@react-navigation/native';
import Header from '@components/header';
import { loansDataListener } from '@network/loan-service';
import LoanConclusion from '@container/loan/loanConclusion';
import { useAuth } from '@context/authContext';
import { common } from '@utils/style';

// Lazy load LoanList component
const LoanList = lazy(() => import('@container/loan/loanList'));

function Loan() {
  const { user } = useAuth()
  const { lang } = useLang();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Optimized data fetching with useCallback
  const fetchData = useCallback(() => {
    const unsubscribeFunctions = [];
    const unsubscribe = loansDataListener(updatedDocuments => {
      setData(updatedDocuments);
      setLoading(false);
    }, unsubscribeFunctions, user?.phone);
    return () => {
      if (unsubscribe) unsubscribe();
      unsubscribeFunctions.forEach(unsub => unsub());
    };
  }, [lang]);

  useFocusEffect(fetchData);
  return (
    <BaseView>
      <Loader visible={loading} />
      <Header label={strings.loan_record} />
      <LoanConclusion data={data} />
      <Suspense fallback={<Loader visible={true} />}>
        <LoanList data={data} />
      </Suspense>
      <Button
        iconLeft="plus"
        label={`${strings.giver} / ${strings.receiver}`}
        btnStyle={styles.button}
        onPress={() => navigate('AddLoan')}
      />
    </BaseView>
  );
}

const styles = {
  button: {
    maxWidth: '60%',
    // paddingHorizontal: 15,
    width: 'auto',
    position: 'absolute',
    bottom: 20,
    right: -5,
    zIndex: 999,
    ...common.shadow
  },
};

export default React.memo(Loan);
