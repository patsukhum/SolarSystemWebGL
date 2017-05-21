var SHAPE = (function() {
   var my = {};

   function addMeshVertices(V, m, n, func) {
      function append(A) {
         for (let i = 0 ; i < A.length ; i++)
            V.push(A[i]);
      }
      for (let j = 0 ; j < n ; j++)
      for (let i = 0 ; i < m ; i++) {
         let A = func( i   /m,  j   /n),
	     B = func((i+1)/m,  j   /n),
             C = func( i   /m, (j+1)/n),
	     D = func((i+1)/m, (j+1)/n);
         append(A); append(B); append(D); // Lower right of square.
         append(D); append(C); append(A); // Upper left of square.
      }
      return V;
   }

   function addDiskVertices(V, n, zSign, z) {
      function f(i) {
         let theta = zSign * 2 * Math.PI * i / n;
	 V.push(Math.cos(theta),Math.sin(theta),z, 0,0,zSign, 0,0);
      }
      for (let i = 0 ; i < n ; i++) {
         f(i  );
         f(i+1);
         V.push(0,0,z, 0,0,zSign, 0,0);
      }
      return V;
   }

   function addTubeVertices(V, n) {
      return addMeshVertices(V, n, 1, function(u, v) {
         let theta = 2 * Math.PI * u;
         let z     = 2 * v - 1;
         let c     = Math.cos(theta);
         let s     = Math.sin(theta);
         return [c,s,z, c,s,0, u,v];
      });
   }

   function addSphereVertices(V,n) {
      return addMeshVertices(V, n, n, function(u, v) {
         let theta = 2 * Math.PI * u;
         let phi = Math.PI * (v - .5);
         let z     = Math.sin(phi);
         let c     = Math.cos(theta) * Math.cos(phi);
         let s     = Math.sin(theta) * Math.cos(phi);
         return [c,s,z, c,s,0, u,v];
      });
   }

   function addTorus(V, n){
     return addMeshVertices(V, n, n, function(u,v){
         var theta = 2 * Math.PI * u;
         var phi = 2 * Math.PI * v;
         var r = 0.1;
         var c = Math.cos(theta) * (1 + r * Math.cos(phi));
         var s = Math.sin(theta) * (1 + r * Math.cos(phi));
         var z = r * Math.sin(phi);

         return [c, s, z, c, s, r*10, u, v];
     });
   }

   function addSmallSphereVertices(V, n){
     return addMeshVertices(V, n, n, function(u,v){
         var theta = 2 * Math.PI * u;
         var phi = Math.PI * (v - .5);
         var denominator = 1.7;
         let c =  Math.cos(theta) * Math.cos(phi)/denominator;
         let s = Math.sin(theta) * Math.cos(phi)/denominator;
         let z = Math.sin(phi)/denominator;
         return [c, s, z, c, s, 0, u, v];

     });
   }

   my.sphere = function(n) {
      var V = [];
      addSphereVertices(V,n);
      return V;
   }

   my.cylinder = function(n) {
      var V = [];
      addDiskVertices(V, n, -1, -1);
      addTubeVertices(V, n);
      addDiskVertices(V, n,  1,  1);
      return V;
   }

   my.spheretorus = function(n) {
     var V = [];
     addTorus(V, n);
     addSmallSphereVertices(V,n);
     return V;
  }

   return my;
})();
