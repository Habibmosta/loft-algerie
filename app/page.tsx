export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            Loft Algérie
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Système de gestion immobilière avec génération de rapports PDF professionnels
          </p>
        </div>

        {/* Navigation Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '60px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center',
            transition: 'transform 0.2s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏢</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              Gestion des Lofts
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
              Gérez vos propriétés immobilières
            </p>
            <a 
              href="/lofts" 
              style={{
                display: 'inline-block',
                background: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Voir les Lofts
            </a>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>💰</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              Transactions
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
              Suivez vos revenus et dépenses
            </p>
            <a 
              href="/transactions" 
              style={{
                display: 'inline-block',
                background: '#16a34a',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Voir Transactions
            </a>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📊</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              Rapports PDF
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
              Générez des rapports professionnels
            </p>
            <a 
              href="/reports" 
              style={{
                display: 'inline-block',
                background: '#9333ea',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Générer Rapports
            </a>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>👥</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              Propriétaires
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
              Gérez vos relations clients
            </p>
            <a 
              href="/loft-owners" 
              style={{
                display: 'inline-block',
                background: '#ea580c',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Voir Propriétaires
            </a>
          </div>
        </div>

        {/* Quick Access */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            Accès Rapide
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            Accédez directement aux fonctionnalités principales
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/dashboard" 
              style={{
                display: 'inline-block',
                background: '#1f2937',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              📊 Dashboard
            </a>
            <a 
              href="/reports" 
              style={{
                display: 'inline-block',
                background: '#7c3aed',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              📄 Rapports PDF
            </a>
          </div>
        </div>

        {/* Status */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: '#22c55e',
            borderRadius: '50%',
            marginRight: '15px'
          }}></div>
          <div>
            <h3 style={{ margin: '0', color: '#166534', fontWeight: 'bold' }}>
              Système Opérationnel
            </h3>
            <p style={{ margin: '5px 0 0 0', color: '#16a34a' }}>
              Tous les services fonctionnent normalement. Génération de rapports PDF disponible.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}